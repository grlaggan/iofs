"""
URL configuration for iofs_server project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from iofs_api.views import (CustomTokenObtainPairView,
                            CustomTokenRefreshView,
                            logout,
                            ChangeUserView,
                            ChangePassword)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('users/change/password/', ChangePassword.as_view(), name='change_password'),
    path('users/change/', ChangeUserView.as_view(), name='change_user'),
    path('', include('iofs_api.urls', namespace='iofs_api')),
    path('api/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/login/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('api/logout/', logout, name='logout'),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)