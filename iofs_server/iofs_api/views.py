from http import HTTPMethod

from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from rest_framework.decorators import action
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework.decorators import api_view
from rest_framework.parsers import MultiPartParser, FormParser

from django.contrib.auth.hashers import make_password, check_password

from iofs_api import models, serializers
from iofs_api.models import PostCategory
from iofs_api.permissions import IsOwnerOrReadOnly, IsOwner
from rest_framework.views import APIView


class ChangeUserView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    @staticmethod
    def post(request, *args, **kwargs):
        user = request.user
        serializer = serializers.ChangeUserSerializer(user, data=request.data)
        print(request.data)

        if serializer.is_valid():
            serializer.save()
            print(serializer.data)
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChangePassword(APIView):
    permission_classes = [IsAuthenticated]

    @staticmethod
    def post(request, *args, **kwargs):
        user = request.user
        password = request.data.get('password')
        new_password = request.data.get('new_password')
        confirm_password = request.data.get('confirm_password')

        if check_password(password, user.password):
            if new_password == confirm_password:
                user.set_password(new_password)
                user.save()
                return Response(serializers.UserSerializer(user).data, status=status.HTTP_200_OK)

            return Response({'status': 'fail'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'status': 'fail'}, status=status.HTTP_400_BAD_REQUEST)


class UserViewSet(viewsets.ModelViewSet):
    queryset = models.User.objects.all()
    serializer_class = serializers.UserSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]

        return super(UserViewSet, self).get_permissions()

    def get_serializer_class(self):
        if self.action == 'create':
            return serializers.RegistrationSerializer

        return super(UserViewSet, self).get_serializer_class()

    def retrieve(self, request, *args, **kwargs):
        user = self.queryset.get(id=request.user.id)
        return Response(self.get_serializer(user).data)


class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            response = super().post(request, *args, **kwargs)

            refresh_token = response.data.get('refresh')

            response.set_cookie(
                key='refresh',
                value=refresh_token,
                httponly=True,
                max_age=60 * 60 * 24 * 7,
                samesite='None',
                secure=True
            )

            del response.data['refresh']

            token = AccessToken(serializer.validated_data['access'])
            response.data['user'] = serializers.UserSerializer(models.User.objects.get(id=token.payload['user_id'])).data

            return response

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh')

        print(refresh_token)
        if not refresh_token:
            return Response(
                {'detail': 'Refresh token missing'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        mutable_data = request.data.copy()
        mutable_data['refresh'] = refresh_token

        request._full_data = mutable_data
        request._data = mutable_data

        response = super().post(request, *args, **kwargs)

        token = AccessToken(response.data['access'])
        user = models.User.objects.get(id=token.payload['user_id'])

        response.data['user'] = serializers.UserSerializer(user).data

        return response


class PostCategoryViewSet(viewsets.ModelViewSet):
    queryset = PostCategory.objects.all()
    serializer_class = serializers.PostCategorySerializer


class PostViewSet(viewsets.ModelViewSet):
    queryset = models.Post.objects.all().order_by('-created')
    serializer_class = serializers.PostSerializer
    permission_classes = (IsOwnerOrReadOnly, )


    def perform_create(self, serializer):
        print(self.request.data.get('category'))
        category = models.PostCategory.objects.get(name=self.request.data.get('category', 'Математика'))
        serializer.save(creator=self.request.user, category=category)


    def create(self, request, *args, **kwargs):
        print(request.data)
        return super(PostViewSet, self).create(request, *args, **kwargs)


    def list(self, request, *args, **kwargs):
        try:
            category = request.query_params.get('category', None)
            theme = request.query_params.get('theme', None)

            if category:
                self.queryset = self.queryset.filter(category__name=category)

            if theme:
                self.queryset = self.queryset.filter(theme=theme)

            filter_param = request.query_params.get('filter', '')
            if filter_param:
                if filter_param == 'new':
                    self.queryset = self.queryset.order_by('-created')

                if filter_param == 'likes':
                    self.queryset = self.queryset.order_by('likes')
                    print(self.queryset)

                if filter_param == 'liked':
                    self.queryset = self.queryset.filter(likes__user=request.user)

                if filter_param == 'favorites':
                    self.queryset = self.queryset.filter(favorites__user=request.user)

                if filter_param == 'of_user':
                    self.queryset = self.queryset.filter(creator=request.user)
        except TypeError:
            return Response(serializers.PostSerializer(self.queryset, many=True).data)

        return Response(serializers.PostSerializer(self.queryset, many=True).data)


    @action(detail=True, methods=[HTTPMethod.DELETE], permission_classes=[IsOwner])
    def delete(self, request, pk):
        if request and request.user.is_authenticated:
            post = models.Post.objects.get(id=pk)
            post.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(status=status.HTTP_400_BAD_REQUEST)


    @action(detail=False, methods=[HTTPMethod.GET], permission_classes=[IsAuthenticated])
    def get_posts_of_user(self, request):
        if request and request.user.is_authenticated:
            posts = models.Post.objects.filter(creator=request.user)
            return Response(serializers.PostSerializer(posts, many=True).data, status=status.HTTP_200_OK)

        return Response(status=status.HTTP_400_BAD_REQUEST)


    @action(detail=True, methods=[HTTPMethod.POST], permission_classes=[IsAuthenticated])
    def like(self, request, pk):
        if request and request.user.is_authenticated:
            post = models.Post.objects.get(pk=pk)
            if post.likes.filter(user=request.user, post=post).exists():
                post.likes.get(user=request.user, post=post).delete()
                return Response(serializers.PostSerializer(post).data, status=status.HTTP_200_OK)
            post.likes.create(user=request.user, post=post)
            return Response(serializers.PostSerializer(post).data, status=status.HTTP_200_OK)

        return Response(status=status.HTTP_400_BAD_REQUEST)


    @action(detail=True, methods=[HTTPMethod.POST], permission_classes=[IsAuthenticated])
    def favorite(self, request, pk):
        if request and request.user.is_authenticated:
            post = models.Post.objects.get(pk=pk)
            if post.favorites.filter(user=request.user, post=post).exists():
                post.favorites.get(user=request.user, post=post).delete()
                return Response(status=status.HTTP_200_OK)
            post.favorites.create(user=request.user, post=post)
            return Response(status=status.HTTP_200_OK)

        return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def logout(request):
    response = Response(status=status.HTTP_205_RESET_CONTENT)
    response.delete_cookie('refresh')
    print(response.cookies)

    return response