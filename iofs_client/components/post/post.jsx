import clsx from "clsx";
import { Favorite } from "./favorite";
import defaultAvatar from "./images/default-avatar.png";
import { ArrowIconDown, LikeIcon } from "./icons";
import Image from "next/image";
import Link from "next/link";
import { formatTimeAgo } from "../../functions";
import { useAuth } from "../user-logic/auth-context";
import { useState } from "react";

export function Post({ initialPost }) {
  const [post, setPost] = useState(initialPost);
  const { state } = useAuth();

  const handleLike = async () => {
    if (!state.accessToken) {
      alert("Войдите, чтобы лайкать посты!");
      return;
    }

    if (post.creator?.id === state.userData.id) {
      alert("You can't like your posts");
      return;
    }

    try {
      // const wasLiked = post.is_liked;
      // const newLikeCount = wasLiked
      //   ? post.likes_count - 1
      //   : post.likes_count + 1;

      // setPost((prev) => ({
      //   ...prev,
      //   likes_count: newLikeCount,
      //   is_liked: !wasLiked,
      // }));

      const response = await fetch(
        `http://127.0.0.1:5000/posts/${post.id}/like/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${state.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Ошибка сервера");

      const updatedPost = await response.json();
      setPost((lastValue) => ({
        ...lastValue,
        ...updatedPost,
      }));
    } catch (error) {
      setPost((prev) => ({
        ...prev,
        likes_count: prev.is_liked
          ? prev.likes_count + 1
          : prev.likes_count - 1,
        is_liked: !prev.is_liked,
      }));
      console.error("Ошибка:", error);
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
          {post.creator?.last_name && post.creator?.first_name
            ? clsx(post.creator?.first_name, post.creator?.last_name)
            : post.creator?.username}
        </span>
        <span className="post__created">{formatTimeAgo(post.created)}</span>
      </div>
      <div className="post-wrapper">
        <Favorite className="top-4 right-4" />
        <span>Категория: {post.category}</span>
        <span className="text-xs">Тема: {post.theme}</span>
        <span className="text-xs">Описание: {post.description}</span>
        <div className="flex justify-between mt-auto items-center">
          <button
            className={clsx(
              "flex gap-2 text-main-white items-center",
              post.is_liked && "liked"
            )}
            onClick={handleLike}
          >
            <LikeIcon liked={post.is_liked} />
            <span>{post.likes_count}</span>
          </button>
          <div className="flex gap-[5px] items-center">
            <Link
              href={`/posts/${post.id}`}
              className="post-wrapper__full-view"
            >
              Полное содержание
            </Link>
            <ArrowIconDown />
          </div>
        </div>
      </div>
    </div>
  );
}
