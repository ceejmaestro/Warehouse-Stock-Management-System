from django.conf import settings
from django.db import models
from django.db.models import Sum
from django.contrib.auth import authenticate
from django.shortcuts import render

from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response  # type: ignore
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.exceptions import ValidationError

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken

from .models import User, Product, Distrib, Notification
from .serializers import (
    UserSerializer,
    ProductSerializer,
    DistribSerializer,
    ProductReactivationSerializer,
)
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import generics, status
from rest_framework.views import APIView
from django.db.models import Sum
from django.core.exceptions import ValidationError
from django.contrib.auth import authenticate

# ------------------------- USER VIEWS -------------------------

class UserListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)


@api_view(['GET'])
def get_users(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def create_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['PUT'])
def update_user(request, pk):
    try:
        user = User.objects.get(id=pk)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)

    serializer = UserSerializer(user, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)


@api_view(['DELETE'])
def delete_user(request, pk):
    try:
        user = User.objects.get(id=pk)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)

    user.delete()
    return Response({'message': 'User deleted successfully'}, status=200)

# ------------------------- PRODUCT VIEWS -------------------------

class ProductList(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


@api_view(['GET'])
def grouped_product_summary(request):
    products = (
        Product.all_objects
        .values('product_name')
        .annotate(total_quantity=Sum('product_qty'))
        .order_by('product_name')
    )
    return Response(products)


class ProductPost(generics.CreateAPIView):
    serializer_class = ProductSerializer


class ProductDetail(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'product_id'


class ProductUpdate(generics.UpdateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'product_id'


class ProductDeactivateView(APIView):
    def post(self, request, product_id):
        try:
            product = Product.all_objects.get(product_id=product_id)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found.'}, status=404)

        if product.is_archived:
            return Response({'message': 'Product is already archived.'}, status=400)

        product.archive()
        return Response({'message': f'Product {product.product_name} has been archived successfully.'})


class ProductReactivateView(APIView):
    def post(self, request, product_id):
        try:
            product = Product.all_objects.get(product_id=product_id)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found.'}, status=404)

        if not product.is_archived:
            return Response({'message': 'Product is already active.'}, status=400)

        serializer = ProductReactivationSerializer(data=request.data)
        if serializer.is_valid():
            try:
                serializer.update(product, serializer.validated_data)
            except Exception as e:
                return Response({'error': str(e)}, status=400)

            if product.is_low_stock():
                product.notify('low_stock', f"{product.product_name} is low on stock: {product.product_qty} left.")
            if product.is_expiring_soon():
                product.notify('expiring_soon', f"{product.product_name} is expiring on {product.product_expiry}.")

            return Response({
                'message': f'✅ Product {product.product_name} has been reactivated.',
                'product_qty': product.product_qty,
                'product_expiry': product.product_expiry
            })

        return Response(serializer.errors, status=400)

# ------------------------- DISTRIBUTION VIEWS -------------------------

class DistribList(generics.ListCreateAPIView):
    queryset = Distrib.objects.filter(is_active=True)
    serializer_class = DistribSerializer

    def create(self, request, *args, **kwargs):
        product_id = request.data.get('product')
        distrib_quantity = int(request.data.get('distrib_quantity', 0))

        try:
            selected_batch = Product.objects.get(product_id=product_id)
        except Product.DoesNotExist:
            raise ValidationError("Product batch does not exist.")

        older_batches = Product.objects.filter(
            product_name=selected_batch.product_name,
            product_expiry__lt=selected_batch.product_expiry,
            product_qty__gt=0,
            is_archived=False
        ).order_by('product_expiry')

        if older_batches.exists():
            raise ValidationError(
                f"Cannot distribute from this batch (Exp: {selected_batch.product_expiry}) "
                f"while older batch (Exp: {older_batches.first().product_expiry}) still has stock."
            )

        total_available = Product.objects.filter(
            product_name=selected_batch.product_name,
            product_qty__gt=0,
            is_archived=False
        ).aggregate(Sum('product_qty'))['product_qty__sum'] or 0

        if distrib_quantity > total_available:
            raise ValidationError("Insufficient total stock across all batches.")

        response = super().create(request, *args, **kwargs)

        first_batch = Product.objects.filter(
            product_name=selected_batch.product_name,
            product_qty__gt=0,
            is_archived=False
        ).order_by('product_expiry').first()

        if first_batch and first_batch.is_low_stock():
            response.data['warning'] = (
                f"⚠ Warning: {first_batch.product_name} is low on stock ({first_batch.product_qty} left)."
            )

        return response


class DistribDetail(generics.RetrieveDestroyAPIView):
    queryset = Distrib.objects.all()
    serializer_class = DistribSerializer
    lookup_field = 'distrib_id'

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.is_active:
            return Response(
                {"error": "FIFO records cannot be deleted as they affect batch integrity."},
                status=400
            )
        instance.is_active = False
        instance.save()
        return Response({"message": "Record marked as inactive."}, status=200)


class DistribUpdateView(generics.UpdateAPIView):
    queryset = Distrib.objects.filter(is_active=True)
    serializer_class = DistribSerializer
    lookup_field = 'distrib_id'

# ------------------------- AUTHENTICATION VIEWS -------------------------

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(request, username=username, password=password)
    if user is not None:
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        response = Response({"message": "Login successful"}, status=200)

        cookie_settings = {
            'httponly': settings.SIMPLE_JWT.get("AUTH_COOKIE_HTTP_ONLY", True),
            'secure': settings.SIMPLE_JWT.get("AUTH_COOKIE_SECURE", False),
            'samesite': settings.SIMPLE_JWT.get("AUTH_COOKIE_SAMESITE", "Lax"),
        }

        response.set_cookie(
            key=settings.SIMPLE_JWT.get("AUTH_COOKIE", "access_token"),
            value=access_token,
            max_age=int(settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"].total_seconds()),
            **cookie_settings
        )

        response.set_cookie(
            key='refresh_token',
            value=str(refresh),
            max_age=int(settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds()),
            **cookie_settings
        )

        return response

    return Response({"message": "Invalid credentials"}, status=401)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    response = Response({'message': 'Logged out successfully'}, status=200)
    response.delete_cookie('access_token')
    response.delete_cookie('refresh_token')
    response.set_cookie('access_token', '', expires=0, httponly=True)
    response.set_cookie('refresh_token', '', expires=0, httponly=True)
    return response


@api_view(['POST'])
@permission_classes([AllowAny])
def refresh_token_view(request):
    refresh_token = request.COOKIES.get('refresh_token')
    if not refresh_token:
        return Response({'error': 'No refresh token'}, status=401)

    try:
        refresh = RefreshToken(refresh_token)
        access = str(refresh.access_token)

        res = Response({'access': access}, status=200)
        res.set_cookie(
            'access_token',
            access,
            httponly=settings.SIMPLE_JWT.get("AUTH_COOKIE_HTTP_ONLY", True),
            samesite=settings.SIMPLE_JWT.get("AUTH_COOKIE_SAMESITE", "Lax"),
            secure=settings.SIMPLE_JWT.get("AUTH_COOKIE_SECURE", False),
            max_age=int(settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"].total_seconds()),
            path="/"
        )
        return res
    except Exception:
        return Response({'detail': 'Invalid refresh token'}, status=403)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def protected_view(request):
    return Response({
        "authenticated": True,
        "user": request.user.username
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_product_by_barcode(request, barcode_no):
    try:
        product = Product.objects.get(barcode_no=barcode_no)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found.'}, status=404)
    serializer = ProductSerializer(product)
    return Response(serializer.data)
