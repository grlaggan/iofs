from rest_framework import serializers

from iofs_api.models import Post, PostCategory, User
from django.contrib.auth.password_validation import validate_password


class UserSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField()

    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'email', 'avatar')


class ChangeUserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=False)

    class Meta:
        model = User
        fields = ('id', 'username', 'last_name', 'first_name', 'email', 'avatar')


class RegistrationSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'password1', 'password2')

    def validate(self, attrs):
        password1 = attrs.get('password1', '')
        password2 = attrs.get('password2', '')

        if password1 != password2:
            raise serializers.ValidationError({'password': 'Пароли должны совпадать!'})

        return attrs

    def create(self, validated_data):
        password1 = validated_data.get('password1', '')

        user = User.objects.create_user(
            username=validated_data['username'],
        )

        user.set_password(password1)
        user.save()
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
                  ]


    @staticmethod
    def get_likes_count(obj):
        return obj.likes.count()



