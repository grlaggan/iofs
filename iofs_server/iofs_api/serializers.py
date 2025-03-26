from rest_framework import serializers
from django.contrib.auth.models import User

from iofs_api.models import Post


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'email')


class PostSerializer(serializers.ModelSerializer):
    creator = serializers.SlugRelatedField(read_only=True, slug_field='username')
    category = serializers.SlugRelatedField(read_only=True, slug_field='name')
    likes_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    is_favorite = serializers.SerializerMethodField()


    class Meta:
        model = Post
        fields = ['id',
                  'creator',
                  'theme',
                  'category',
                  'description',
                  'text',
                  'created',
                  'likes_count',
                  'is_liked',
                  'is_favorite'
                  ]


    @staticmethod
    def get_likes_count(obj):
        return obj.likes.count()


    def get_is_liked(self, obj):
        request = self.context.get('request')

        if request and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()

        return False


    def get_is_favorite(self, obj):
        request = self.context.get('request')

        if request and request.user.is_authenticated:
            return obj.favorites.filter(user=request.user).exists()

        return False


