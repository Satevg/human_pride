from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('', include('pride.urls')),
    path('admin/', admin.site.urls),
]
