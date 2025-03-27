from rest_framework import serializers

from iofs_api.models import Post, PostCategory, User


class UserSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField()

    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'email', 'password', 'avatar')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
        )

        return user


class PostCategorySerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False)

    class Meta:
        model = PostCategory
        fields = ['id', 'name', 'image']


class PostSerializer(serializers.ModelSerializer):
    creator = UserSerializer(read_only=True)
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


