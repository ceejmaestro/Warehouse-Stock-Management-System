from rest_framework import serializers, status # type: ignore
from .models import User

from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from django.core.exceptions import ValidationError
from django.shortcuts import get_object_or_404
from .models import Product, Distrib, User, Notification


# user
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

    def validate_username(self, value):
        value = value.strip().lower()
        user_id = self.instance.id if self.instance else None
        if User.objects.filter(username__iexact=value).exclude(id=user_id).exists():
            raise serializers.ValidationError("Username already exists.")
        return value
    
    def validate_contact(self, value):
        value = value.strip()
        user_id = self.instance.id if self.instance else None
        if User.objects.filter(contact=value).exclude(id=user_id).exists():
            raise serializers.ValidationError("Contact number already exists.")
        return value


#  product
class ProductSerializer(serializers.ModelSerializer):
    is_archived = serializers.BooleanField(read_only=True)
    archived_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Product
        fields = [
            'product_id',
            'barcode_no',
            'product_name',
            'product_detail',
            'product_qty',
            'product_expiry',
            'is_archived',
            'archived_at',
        ]

    def validate_product_qty(self, value):
        if value < 0:
            raise serializers.ValidationError("Product quantity cannot be negative.")
        if value > Product.MAX_STOCK:
            raise serializers.ValidationError(f"Product quantity cannot exceed {Product.MAX_STOCK}.")
        return value

    def update(self, instance, validated_data):
        if instance.is_archived:
            raise serializers.ValidationError("This product is archived. Reactivate it first to update.")
        return super().update(instance, validated_data)
    

#  product reactivation serializer
class ProductReactivationSerializer(serializers.Serializer):
    product_qty = serializers.IntegerField(min_value=0)
    product_expiry = serializers.DateField()

    def validate_product_qty(self, value):
        if value > Product.MAX_STOCK:
            raise serializers.ValidationError(f"Product quantity cannot exceed {Product.MAX_STOCK}.")
        return value

    def update(self, instance, validated_data):
        try:
            instance.reactivate(
                new_qty=validated_data['product_qty'],
                new_expiry=validated_data['product_expiry']
            )
        except ValidationError as e:
            raise serializers.ValidationError(str(e))
        return instance

    def save(self, **kwargs):
        return self.update(self.instance, self.validated_data)
    

#  product reactivate view
class ProductReactivateView(GenericAPIView):
    serializer_class = ProductReactivationSerializer

    def get_object(self):
        product_id = self.kwargs['product_id']
        try:
            return Product.all_objects.get(product_id=product_id)
        except Product.DoesNotExist:
            return None

    def post(self, request, product_id):
        product = self.get_object()
        if product is None:
            return Response({'error': 'Product not found.'}, status=status.HTTP_404_NOT_FOUND)

        if not product.is_archived:
            return Response({'message': 'Product is already active.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            try:
                serializer.update(product, serializer.validated_data)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

            # Notify if the product is low on stock or expiring soon after reactivation
            if product.is_low_stock():
                product.notify('low_stock', f"{product.product_name} is low on stock: {product.product_qty} left.")
            if product.is_expiring_soon():
                product.notify('expiring_soon', f"{product.product_name} is expiring on {product.product_expiry}.")

            return Response({
                'message': f'✅ Product {product.product_name} has been reactivated.',
                'product_qty': product.product_qty,
                'product_expiry': product.product_expiry
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#  distribution
class DistribSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.product_name', read_only=True)
    product_qty = serializers.IntegerField(source='product.product_qty', read_only=True)

    class Meta:
        model = Distrib
        fields = [
            'distrib_id',
            'product',
            'product_name',
            'product_qty',
            'distrib_quantity',
            'is_active',
        ]

    def create(self, validated_data):
        distrib = super().create(validated_data)
        
        # Check low stock and expiring soon for the product
        product = distrib.product
        if product.is_low_stock():
            product.notify('low_stock', f"{product.product_name} is low on stock: {product.product_qty} left.")
        if product.is_expiring_soon():
            product.notify('expiring_soon', f"{product.product_name} is expiring on {product.product_expiry}.")
        
        return distrib