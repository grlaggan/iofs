from http import HTTPMethod

from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.decorators import action

from iofs_api import models, serializers
from iofs_api.models import PostCategory
from iofs_api.permissions import IsOwnerOrReadOnly


class UserViewSet(viewsets.ModelViewSet):
    queryset = models.User.objects.all()
    serializer_class = serializers.UserSerializer


class PostCategoryViewSet(viewsets.ModelViewSet):
    queryset = PostCategory.objects.all()
    serializer_class = serializers.PostCategorySerializer


class PostViewSet(viewsets.ModelViewSet):
    queryset = models.Post.objects.all()
    serializer_class = serializers.PostSerializer
    permission_classes = (IsOwnerOrReadOnly, )


    def perform_create(self, serializer):
        category = models.PostCategory.objects.get(name=self.request.query_params.get('category', 'Математика'))
        serializer.save(creator=self.request.user, category=category)


    def list(self, request, *args, **kwargs):
        data = request.query_params.get('theme', '')
        print(data)

        if data:
            queryset = self.queryset.filter(theme=data)
            return Response(serializers.PostSerializer(queryset, many=True).data)

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
                return Response(status=status.HTTP_200_OK)
            post.likes.create(user=request.user, post=post)
            return Response(status=status.HTTP_200_OK)

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

