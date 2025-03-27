from rest_framework import routers

from iofs_api import views

app_name = 'iofs_api'

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet, basename='user')
router.register(r'posts', views.PostViewSet, basename='post')
router.register(r'post_categories', views.PostCategoryViewSet, basename='post_category')

urlpatterns = router.urls

