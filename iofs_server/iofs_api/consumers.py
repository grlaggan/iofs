from channels.generic.websocket import AsyncJsonWebsocketConsumer
from rest_framework_simplejwt.tokens import AccessToken
from channels.db import database_sync_to_async
from urllib.parse import parse_qs

from iofs_api.models import Post, User
from iofs_api import serializers


class PostConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        await self.accept()
        data = await self.get_queryset_with_filter()
        await self.send_json({
            'type': 'initial_data',
            'posts': data
        })


    @database_sync_to_async
    def get_queryset_with_filter(self):
        queryset = Post.objects.all()
        user = None

        try:
            query_string = self.scope.get('query_string', b"").decode('utf-8')
            params = parse_qs(query_string)

            token = params.get('token', [None])[0]
            if token:
                user = User.objects.get(id=AccessToken(token)['user_id'])

            category = params.get('category', [None])[0]
            theme = params.get('theme', [None])[0]

            if category:
                queryset = queryset.filter(category__name=category)

            if theme:
                queryset = queryset.filter(theme=theme)

            filter_param = params.get('filter', [None])[0]
            if filter_param:
                if filter_param == 'new':
                    queryset = queryset.order_by('-created')

                if filter_param == 'likes':
                    queryset = queryset.order_by('likes')

                if filter_param == 'liked':
                    queryset = queryset.filter(likes__user=user)

                if filter_param == 'favorites':
                    queryset = queryset.filter(favorites__user=user)

                if filter_param == 'of_user':
                    queryset = queryset.filter(creator=user)
                    print(queryset)
        except:
            print('error')

        return serializers.PostSerializer(queryset, many=True).data
