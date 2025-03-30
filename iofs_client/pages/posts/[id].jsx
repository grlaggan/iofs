import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Image from "next/image";
import defaultAvatar from "../../components/post/images/default-avatar.png";
import { formatTimeAgo } from "../../functions";
import { Header } from "../../components/header";
import { Favorite } from "../../components/post";
import Link from "next/link";
import { LikeIcon } from "../../components/post/icons";
import { PostsList } from "../../components/main/posts-list";
import clsx from "clsx";
import { useAuth } from "../../components/user-logic/auth-context";

export default function DetailPost() {
  const router = useRouter();
  const postID = router.query.id;
  const url = `http://127.0.0.1:5000/posts/${postID}/`;
  const { state } = useAuth();

  const [post, setPost] = useState({});

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
      const wasLiked = post.is_liked;
      const newLikeCount = wasLiked
        ? post.likes_count - 1
        : post.likes_count + 1;

      setPost((prev) => ({
        ...prev,
        likes_count: newLikeCount,
        is_liked: !wasLiked,
      }));

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
      setPost(updatedPost);
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

  useEffect(() => {
    if (!postID) return;

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
      })
      .then((result) => setPost(result));
  }, [postID, url]);

  const creator = post.creator || {};
  const theme = post.theme || "";
  const category = post.category || "";
  const text = post.text || "";
  const likes = post.likes_count || 0;
  const is_liked = post.is_liked || false;
  const avatarSrc = creator.avatar || defaultAvatar;
  const displayName = creator.last_name
    ? `${creator.first_name} ${creator.last_name}`
    : creator.username || "Неизвестный пользователь";
  const postDate = post.created
    ? formatTimeAgo(post.created)
    : "Дата неизвестна";

  console.log(post);

  return (
    <>
      <Header />
      <main className="main px-4">
        <Link
          href="/"
          className="text-main-white text-xs mt-4 underline inline-block"
        >
          Назад
        </Link>
        <div className="detail-post relative flex flex-col gap-8 mt-4">
          <div className="flex flex-col gap-4">
            <div className="detail-post__user h-6">
              <div className="h-6 w-6 rounded-full overflow-hidden">
                <Image
                  src={avatarSrc}
                  width={24}
                  height={24}
                  unoptimized
                  className="object-cover w-full h-full"
                  alt="User Avatar"
                />
              </div>
              <span className="detail-post__text">{displayName}</span>
              <span className="detail-post__text">{postDate}</span>
            </div>
            <h1 className="text-main-white text-4xl">{theme}</h1>
            <span className="text-main-white">{`Категория: ${category}`}</span>
          </div>
          <div className="flex flex-col gap-4">
            <p className="text-main-white text-[16px]">{text}</p>
            <button
              className={clsx(
                "flex gap-2 text-main-white items-center",
                is_liked && "liked"
              )}
              onClick={handleLike}
            >
              <LikeIcon liked={is_liked} />
              <span>{likes}</span>
            </button>
          </div>
          <Favorite className="top-0 right-5" />
          <div className="bg-main-white w-[100%] h-[1px] opacity-50 mt-[-16px]"></div>
          <PostsList />
        </div>
      </main>
    </>
  );
}
