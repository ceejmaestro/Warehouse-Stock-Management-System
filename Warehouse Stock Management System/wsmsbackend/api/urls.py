from django.urls import path
from .views import (
    get_users, create_user, update_user, delete_user,
    login_view, protected_view, logout_view, refresh_token_view,
    UserListView,
    ProductList, ProductPost, ProductDetail, ProductUpdate,
    ProductDeactivateView, ProductReactivateView,
    DistribList, DistribDetail, DistribUpdateView, 
    grouped_product_summary, get_product_by_barcode
)
from rest_framework_simplejwt import views as jwt_views

from django.urls import include, path

urlpatterns = [
    # user
    path('users/', get_users, name='get_users'),
    path('users/create/', create_user, name='create_user'),
    path('users/update/<int:pk>/', update_user, name='update_user'),
    path('users/delete/<int:pk>/', delete_user, name='delete_user'),

    # product
    path('products/', ProductList.as_view(), name='product-list'),
    path('products/create/', ProductPost.as_view(), name='product-create'),
    path('products/id/<str:product_id>/', ProductDetail.as_view(), name='product-detail'),
    path('products/update/<str:product_id>/', ProductUpdate.as_view(), name='product-update'),
    path('products/<str:product_id>/archive/', ProductDeactivateView.as_view(), name='product-archive'), 
    path('products/<str:product_id>/reactivate/', ProductReactivateView.as_view(), name='product-reactivate'),

    path('products/barcode/<str:barcode_no>/', get_product_by_barcode, name='product-by-barcode'),

    # distribution
    path('distributions/', DistribList.as_view(), name='distrib-list'),
    path('distributions/<int:distrib_id>/', DistribDetail.as_view(), name='distrib-detail'),
    path('distributions/update/<int:distrib_id>/', DistribUpdateView.as_view(), name='distrib-update'),  

    # jwt
    path('api/token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),

    # additional custom views
    path('login/', login_view),
    path('logout/', logout_view),
    path('refresh/', refresh_token_view),
    path('protected/', protected_view),

    path('api/users/', UserListView.as_view(), name='user_list'),
    path('api/grouped-products/', grouped_product_summary, name='grouped-products'),

    # alias paths to support duplicated api/api prefix in frontend URLs
    path('api/', include([
        path('items/', ProductList.as_view(), name='items-list'),
        path('distribs/', DistribList.as_view(), name='distribs-list'),
    ])),
]
