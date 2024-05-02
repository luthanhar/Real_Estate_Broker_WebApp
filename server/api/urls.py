from django.urls import path
from . import views
from rest_framework_simplejwt import views as jwt_views

urlpatterns = [
    path('properties', views.property_list, name='property_list'),
    path('properties/<int:id>', views.property_by_id, name='property_by_id'),
    path('getproperties/<int:id>', views.get_property_by_id, name='get_property_by_id'),
    path('orders/buy/<int:id>', views.buy_orders, name='buy_orders'),
    path('orders/sell/<int:id>', views.sell_orders, name='sell_orders'),
    path('funds/<int:id>', views.funds, name='funds'),
    path('watchlist/<int:id>', views.watchlist, name='watchlist'),
    path('portfolio/<int:id>', views.portfolio, name='portfolio'),
    path('marketorder', views.marketOrder, name='market_order'),
    path('limitorder', views.limitOrder, name='limit_order'),
    path('register', views.register, name='register'),
    path('users/<int:id>', views.get_user, name='get_user'),
    path('support', views.support, name='support'),
    path('token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
]