from django.contrib import admin
from django.urls import include, path
from django.conf.urls.static import static
from projectbackend import settings
from products import views
from products.views import AdminLoginView, VerifyTokenView, UpdateAdminView, ProductsForPublicView, SpringOrdersList, AccessoryOrdersList, MachineryOrdersList, CloseOrder
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/generate_whatsapp_url/', views.generate_whatsapp_url, name='generate_whatsapp_url'),
    path('api/save_service_request/', views.save_service_request, name='save_service_request'),
    path('api/admin_registration/', views.admin_registration, name='admin_registration'),
    path('api/admin_login/', AdminLoginView.as_view(), name='admin_login'),
    path('api/verify_token/', VerifyTokenView.as_view(), name='verify_token'),
    path('api/refresh_token/', TokenRefreshView.as_view(), name='refresh_token'),
    path('api/get_admins/', views.get_admins, name='get_admins'),
    path('api/update_admin/<int:pk>/', UpdateAdminView.as_view(), name='update_admin'),
    path('api/delete_admin/<int:pk>/', views.delete_admin, name='delete_admin'),
    path('api/get_products/', views.get_products, name='get_products'),
    path('api/add_product/', views.add_product, name='add_product'),
    path('api/update_product/<int:pk>/', views.update_product, name='update_product'),
    path('api/delete_product/<int:pk>/', views.delete_product, name='delete_product'),
    path('api/products_for_public/', ProductsForPublicView.as_view(), name='products_for_public'),
    path('api/submit_springs_order/', views.submit_springs_order, name='submit_spring_order'),
    path('api/submit_accessories_order/', views.submit_accessories_order, name='submit_accessory_order'),
    path('api/submit_machineries_order/', views.submit_machineries_order, name='submit_machinery_order'),
    path('api/send_mail_through_contact/',views.send_mail_through_contact, name='send_mail_through_contact'),
    path('api/get_spring_orders_list/',SpringOrdersList.as_view(), name='get_spring_orders_list'),
    path('api/get_accessory_orders_list/',AccessoryOrdersList.as_view(), name='get_accessory_orders_list'),
    path('api/get_machinery_orders_list/',MachineryOrdersList.as_view(), name='get_machinery_orders_list'),
    path('close_order/<str:order_type>/<int:pk>/', CloseOrder.as_view(), name='close-order'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
