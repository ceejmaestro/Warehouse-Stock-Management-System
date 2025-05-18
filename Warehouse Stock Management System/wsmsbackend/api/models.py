# Create your models here.
from django.db import models  # type: ignore
from datetime import date, timedelta
from django.core.exceptions import ValidationError
from django.utils import timezone
from django.core.validators import MinValueValidator
from django.db.models import Sum

# user
class User(models.Model):
    id = models.AutoField(primary_key=True)
    firstname = models.CharField(max_length=50, null=True, blank=True)
    lastname = models.CharField(max_length=50, null=True, blank=True)
    birthdate = models.DateField(null=True, blank=True)
    contact = models.CharField(max_length=15, null=True, blank=True, unique=True)

    username = models.CharField(max_length=50, null=True, blank=True, unique=True)
    password = models.CharField(max_length=50, null=True, blank=True)

    role = models.CharField(max_length=50, null=True, blank=True,  default='Supervisor')
    status = models.CharField(max_length=50, null=True, blank=True,  default='Active')

    def __str__(self):
        return self.username

    class Meta:
        db_table = 'tbl_user'

# notification
class Notification(models.Model):
    NOTIF_TYPE_CHOICES = [
        ('archived', 'Archived'),
        ('low_stock', 'Low Stock'),
        ('expiring_soon', 'Expiring Soon'),
    ]

    notif_id = models.AutoField(primary_key=True)
    notif_type = models.CharField(max_length=20, choices=NOTIF_TYPE_CHOICES)
    product = models.ForeignKey('Product', on_delete=models.CASCADE)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'tbl_notification'

    def __str__(self):
        return f"{self.get_notif_type_display()} - {self.product.product_name}"

class ProductManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_archived=False)

class ArchivedProductManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset()

# product
class Product(models.Model):

    MAX_STOCK = 1000
    LOW_STOCK_THRESHOLD = int(MAX_STOCK * 0.35)  # 35% stock left

    product_id = models.CharField(max_length=255, primary_key=True)
    barcode_no = models.CharField(max_length=20)
    product_name = models.CharField(max_length=100)
    product_detail = models.CharField(max_length=255)
    product_qty = models.IntegerField(validators=[MinValueValidator(0)])
    product_expiry = models.DateField()

    is_archived = models.BooleanField(default=False)
    archived_at = models.DateTimeField(null=True, blank=True)

    objects = ProductManager()
    all_objects = ArchivedProductManager()

    class Meta:
        db_table = "tbl_product"

    def __str__(self):
        return self.product_name

    def clean(self):
        if self.product_qty < 0:
            raise ValidationError("Product quantity cannot be negative.")
        if self.product_qty > Product.MAX_STOCK:
            raise ValidationError(f"Product quantity cannot exceed {Product.MAX_STOCK}.")

    def is_low_stock(self):
        return self.product_qty <= Product.LOW_STOCK_THRESHOLD

    def is_expiring_soon(self):
        return timezone.now().date() + timedelta(days=30) >= self.product_expiry

    def notify(self, notif_type, message):
        Notification.objects.create(
            notif_type=notif_type,
            product=self,
            message=message
        )

    def archive(self):
        if self.is_archived:
            raise ValidationError("Product is already archived.")
        self.is_archived = True
        self.archived_at = timezone.now()
        self.save()
        self.notify('archived', f"{self.product_name} has been archived due to zero stock.")

    def reactivate(self, new_qty: int, new_expiry):
        if not self.is_archived:
            raise ValidationError("Product is already active.")
        self.is_archived = False
        self.archived_at = None
        self.product_qty = new_qty
        self.product_expiry = new_expiry
        self.clean()
        self.save()

# distribution
class Distrib(models.Model):
    distrib_id = models.AutoField(primary_key=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    distrib_quantity = models.IntegerField(validators=[MinValueValidator(1)])
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'tbl_distrib'

    def __str__(self):
        return f"Distribution {self.distrib_id} for {self.product.product_name} ({self.distrib_quantity} units)"

    def restore_stock(self, original_quantity):
        restored = original_quantity
        product_batches = Product.all_objects.filter(
            product_name=self.product.product_name,
            is_archived=False
        ).order_by('product_expiry')

        for batch in reversed(product_batches):
            space = Product.MAX_STOCK - batch.product_qty
            restore_amount = min(space, restored)
            batch.product_qty += restore_amount
            batch.clean()
            batch.save()
            restored -= restore_amount
            if restored == 0:
                break

        if restored > 0:
            raise ValidationError("Failed to restore full original stock — data may be inconsistent.")

    def deduct_stock_fifo(self, new_quantity):
        remaining_qty = new_quantity
        product_batches = Product.objects.filter(
            product_name=self.product.product_name,
            product_qty__gt=0,
            is_archived=False
        ).order_by('product_expiry')

        for batch in product_batches:
            if remaining_qty == 0:
                break
            deduction = min(batch.product_qty, remaining_qty)
            batch.product_qty -= deduction
            batch.clean()

            if batch.product_qty == 0:
                batch.archive()
            else:
                batch.save()
                if batch.is_low_stock():
                    batch.notify('low_stock', f"{batch.product_name} is low on stock: {batch.product_qty} left.")
                if batch.is_expiring_soon():
                    batch.notify('expiring_soon', f"{batch.product_name} is expiring on {batch.product_expiry}.")

            remaining_qty -= deduction

        if remaining_qty > 0:
            raise ValidationError("Not enough stock to fulfill the new distribution quantity.")

        self.product = product_batches.first()

    def save(self, *args, **kwargs):
        if self.pk:
            old = Distrib.objects.get(pk=self.pk)
            if old.distrib_quantity != self.distrib_quantity:
                self.restore_stock(old.distrib_quantity)
                self.deduct_stock_fifo(self.distrib_quantity)
        else:
            # FIFO enforcement: check for older batches with stock
            older_batches = Product.objects.filter(
                product_name=self.product.product_name,
                product_expiry__lt=self.product.product_expiry,
                product_qty__gt=0,
                is_archived=False
            ).order_by('product_expiry')

            if older_batches.exists():
                raise ValidationError(
                    f"Cannot distribute from this batch (Exp: {self.product.product_expiry}) "
                    f"while older batch (Exp: {older_batches.first().product_expiry}) still has stock."
                )

            # Total available check
            total_stock = Product.objects.filter(
                product_name=self.product.product_name,
                product_qty__gt=0,
                is_archived=False
            ).aggregate(Sum('product_qty'))['product_qty__sum'] or 0

            if self.distrib_quantity > total_stock:
                raise ValidationError("Distributed quantity exceeds total available stock for this product.")

            self.deduct_stock_fifo(self.distrib_quantity)

        super().save(*args, **kwargs)

def get_inventory_distribution_summary():
    # Get remaining stock grouped by product_name
    inventory = (
        Product.all_objects
        .filter(is_archived=False)
        .values('product_name')
        .annotate(total_stock=Sum('product_qty'))
    )

    # Get distributed quantities grouped by product_name
    distribution = (
        Distrib.objects
        .filter(is_active=True)
        .values('product__product_name')
        .annotate(total_distributed=Sum('distrib_quantity'))
    )

    # Convert to dict for quick access
    inventory_dict = {item['product_name']: item['total_stock'] for item in inventory}
    distribution_dict = {item['product__product_name']: item['total_distributed'] for item in distribution}

    # Merge them
    all_product_names = set(inventory_dict) | set(distribution_dict)
    summary = []

    for name in all_product_names:
        summary.append({
            'product_name': name,
            'inventory_quantity': inventory_dict.get(name, 0),
            'distributed_quantity': distribution_dict.get(name, 0)
        })

    return summary
