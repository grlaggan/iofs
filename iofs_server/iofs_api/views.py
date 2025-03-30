from http import HTTPMethod

from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.decorators import action
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import AccessToken

from iofs_api import models, serializers
from iofs_api.models import PostCategory
from iofs_api.permissions import IsOwnerOrReadOnly


class UserViewSet(viewsets.ModelViewSet):
    queryset = models.User.objects.all()
    serializer_class = serializers.UserSerializer
    permission_classes = [IsAuthenticated]

    def retrieve(self, request, *args, **kwargs):
        user = self.queryset.get(id=request.user.id)
        return Response(self.get_serializer(user).data)


class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            response = super().post(request, *args, **kwargs)

            token = AccessToken(serializer.validated_data['access'])
            response.data['user'] = serializers.UserSerializer(models.User.objects.get(id=token.payload['user_id'])).data

            return response

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.data.get('refresh')

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
        category = models.PostCategory.objects.get(name=self.request.query_params.get('category', 'Математика'))
        serializer.save(creator=self.request.user, category=category)


    def list(self, request, *args, **kwargs):
        data_for_theme = request.query_params.get('theme', '')
        data_for_category = request.query_params.get('category', '')
        data_filter = request.query_params.get('filter', '')

        try:
            if data_for_theme:
                queryset = self.queryset.filter(theme=data_for_theme)
                return Response(serializers.PostSerializer(queryset, many=True).data)

            if data_for_category:
                queryset = self.queryset.filter(category__name=data_for_category)
                return Response(serializers.PostSerializer(queryset, many=True).data)

            if data_filter:
                if data_filter == 'new':
                    queryset = self.queryset.order_by('-created')
                    return Response(serializers.PostSerializer(queryset, many=True).data)

                if data_filter == 'likes':
                    queryset = self.queryset.order_by('likes')
                    return Response(serializers.PostSerializer(queryset, many=True).data)

                if data_filter == 'liked':
                    queryset = self.queryset.filter(likes__user=request.user)
                    return Response(serializers.PostSerializer(queryset, many=True).data)

                if data_filter == 'favorites':
                    queryset = self.queryset.filter(favorites__user=request.user)
                    return Response(serializers.PostSerializer(queryset, many=True).data)

                if data_filter == 'of_user':
                    queryset = self.queryset.filter(creator=request.user)
                    return Response(serializers.PostSerializer(queryset, many=True).data)

        except:
            return Response(serializers.PostSerializer(self.queryset, many=True).data)

        return Response(serializers.PostSerializer(self.queryset, many=True).data)


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

