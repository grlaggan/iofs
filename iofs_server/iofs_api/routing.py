from django.urls import path
from iofs_api.consumers import PostConsumer


ws_urlpatterns = [
    path('posts/', PostConsumer.as_asgi())
]