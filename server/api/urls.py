from django.urls import path
from . import views

urlpatterns = [
    path('properties', views.property),
    path('properties/<int:id>', views.property_by_id),
    path('orders/buy/<int:id>', views.buy_orders),
    path('orders/sell/<int:id>', views.sell_orders),
<<<<<<< HEAD
    path('register', views.register),
    path('login/', views.login),
     
=======
    path('funds/<int:id>', views.funds),
    path('watchlist/<int:id>', views.watchlist),
    path('portfolio/<int:id>', views.portfolio),
    path('marketorder', views.marketOrder),
    path('limitorder', views.limitOrder),
>>>>>>> upstream/backend
]