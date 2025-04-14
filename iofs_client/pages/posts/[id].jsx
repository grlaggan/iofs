import { useRouter } from "next/router";
import { useState, useEffect, useContext, useRef } from "react";
import Image from "next/image";
import { formatTimeAgo } from "../../functions";
import { Header } from "../../components/header";
import { FavoriteIcon } from "../../components/post/icons";
import Link from "next/link";
import { LikeIcon } from "../../components/post/icons";
import { PostsList } from "../../components/main/posts-list";
import { Context } from "../_app";
import $api from "../../components/http";
import defaultAvatarSrc from "../../components/post/images/default-avatar.png";
import axios from "axios";
import gsap from "gsap";

export default function DetailPost() {
  const router = useRouter();
  const postID = router.query.id;

  const mainRef = useRef(null);

  const { store } = useContext(Context);

  const initialPost = store.cachedPost;

  const [post, setPost] = useState(initialPost);

  const postDeleteUrl = `http://127.0.0.1:5000/posts/${postID}/delete/`;

  const deletePost = async () => {
    try {
      await $api.delete(postDeleteUrl);
    } catch (error) {
      console.log(error.response?.data?.message);
    }
  };

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

      setPost((prevPost) => {
        return { ...prevPost, ...response.data };
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
      alert("Войдите, чтобы лайкать посты!");
      return;
    }

    try {
      const response = await $api.post(`/posts/${post.id}/like/`);

      setPost((prevPost) => {
        return { ...prevPost, ...response.data };
      });

      if (!response.ok) {
        throw new Error("Ошибка лайка!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const postDate = post.created
    ? formatTimeAgo(post.created)
    : "Дата неизвестна";

  console.log(post);

  useEffect(() => {
    if (!postID) return;
    store.checkAuth();

    const abortController = new AbortController();

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5000/posts/${postID}/`,
          {
            signal: abortController.signal,
          }
        );

        setPost((prevPost) => {
          return { ...prevPost, ...response.data };
        });

        if (!response.ok) {
          throw new Error();
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();

    return () => abortController.abort();
  }, [postID]);

  useEffect(() => {
    gsap.fromTo(
      mainRef.current,
      {
        y: -30,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
      }
    );
  }, []);

  const postTheme = post.theme || "";
  const postCategory = post.category || "";
  const postText = post.text || "";
  const postLikes = post.likes_count || 0;
  const postCreator = post.creator || {};
  const postCreatorUsername = postCreator.username;
  const avatarSrc = postCreator.avatar || defaultAvatarSrc;
  const displayName = postCreator.first_name
    ? `${postCreator.first_name} ${postCreator.last_name}`
    : "";

  return (
    <>
      {postTheme ? (
        <>
          <Header />
          <main className="main px-4" ref={mainRef}>
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
                  <span className="detail-post__text">
                    {displayName || postCreatorUsername}
                  </span>
                  <span className="detail-post__text">{postDate}</span>
                  {postCreator.username === store.user.username ? (
                    <button
                      className="text-main-white text-xs underline opacity-60"
                      onClick={() => {
                        deletePost();
                        window.location.href = "/";
                      }}
                    >
                      Удалить пост
                    </button>
                  ) : null}
                </div>
                <h1 className="text-main-white text-4xl">{postTheme}</h1>
                <span className="text-main-white">{`Категория: ${postCategory}`}</span>
              </div>
              <div className="flex flex-col gap-4">
                <p className="text-main-white text-[16px]">{postText}</p>
                <button
                  className="flex w-fit gap-2 text-main-white items-center"
                  onClick={handleLike}
                >
                  <LikeIcon />
                  {postLikes}
                </button>
              </div>
              <button
                className="absolute top-0 right-5"
                onClick={handleFavorite}
              >
                <FavoriteIcon />
              </button>
              <div className="bg-main-white w-[100%] h-[1px] opacity-50 mt-[-16px]"></div>
              <PostsList />
            </div>
          </main>
        </>
      ) : (
        <div class="frame">
          <span class="image image-loading">
            <span class="spinner">
              <span class="spinner-inner spinner-wandering-cubes">
                <span class="spinner-item"></span>
                <span class="spinner-item"></span>
              </span>
            </span>
          </span>
        </div>
      )}
    </>
  );
}
