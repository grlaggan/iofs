import clsx from "clsx";
import defaultAvatar from "./images/default-avatar.png";
import { ArrowIconDown, LikeIcon, FavoriteIcon } from "./icons";
import Image from "next/image";
import Link from "next/link";
import { formatTimeAgo } from "../../functions";
import { useState, useContext } from "react";
import { Context } from "../../pages/_app";
import { observer } from "mobx-react-lite";
import $api from "../http";

export const Post = observer(({ initialPost }) => {
  const [post, setPost] = useState(initialPost);
  const { store } = useContext(Context);

  const handleFavorite = async () => {
    if (!localStorage.getItem("token")) {
      alert("Войдите, чтобы добавлять посты в избранные!");
      return;
    }

    if (post.creator?.id === store.user.id) {
      alert("Вы не можете добавлять свои посты в избранные!");
      return;
    }

    try {
      const response = await $api.post(`/posts/${post.id}/favorite/`);

      setPost((post) => {
        return { ...post, ...response.data };
      });

      if (!response.ok) {
        throw new Error("Ошибка при добавлении поста в избранные!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLike = async () => {
    if (!localStorage.getItem("token")) {
      alert("Войдите, чтобы лайкать посты!");
      return;
    }

    if (post.creator?.id === store.user.id) {
      alert("Вы не можете лайкать свои посты!");
      return;
    }

    try {
      const response = await $api.post(`/posts/${post.id}/like/`);

      setPost((post) => {
        return { ...post, ...response.data };
      });

      if (!response.ok) {
        throw new Error("Ошибка лайка!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="post flex flex-col gap-2 mt-2">
      <div className="flex gap-2 items-center">
        <div className="w-6 h-6 rounded-full overflow-hidden">
          <Image
            src={
              post.creator?.avatar
                ? `http://127.0.0.1:5000${post.creator?.avatar}`
                : defaultAvatar
            }
            width={24}
            height={24}
            unoptimized
            className="object-cover w-full h-full"
          />
        </div>
        <span className="post__username">
          {post.creator?.first_name
            ? `${post.creator?.last_name} ${post.creator?.first_name}`
            : post.creator?.username}
        </span>
        <span className="post__created">{formatTimeAgo(post.created)}</span>
      </div>
      <div className="post-wrapper">
        <button
          className="absolute top-4 right-4 hover:brightness-125"
          onClick={handleFavorite}
        >
          <FavoriteIcon />
        </button>
        <span className="text-[15px]">Категория: {post.category}</span>
        <span className="text-xs">Тема: {post.theme}</span>
        <span className="text-xs">Описание: {post.description}</span>
        <div className="flex justify-between mt-auto items-center">
          <button
            className="flex gap-2 text-main-white items-center hover:brightness-125"
            onClick={handleLike}
          >
            <LikeIcon />
            <span>{post.likes_count}</span>
          </button>
          <div className="flex gap-[5px] items-center">
            <Link
              href={`/posts/${post.id}`}
              className="post-wrapper__full-view hover:underline"
              onClick={() => store.setCachedPost(post)}
            >
              Полное содержание
            </Link>
            <ArrowIconDown />
          </div>
        </div>
      </div>
    </div>
  );
});
