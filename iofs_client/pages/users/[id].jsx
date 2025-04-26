import { useState, useEffect, useContext, useRef } from "react";
import { Header } from "../../components/header";
import Image from "next/image";
import Link from "next/link";
import { Context } from "../_app";
import { ArrowIconDown } from "../../components/post/icons";
import { PostsList } from "../../components/main/posts-list";
import clsx from "clsx";
import { observer } from "mobx-react-lite";
import defaultAvatar from "../../components/post/images/default-avatar.png";
import gsap from "gsap";
import Head from "next/head";

const UserDetail = observer(() => {
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [selectedSort, setSelectedSort] = useState("Ваши посты");
  const [load, setLoad] = useState(false);
  const { store } = useContext(Context);

  const mainRef = useRef(null);

  const handleSortSelect = (value) => {
    setShowSortDropdown(false);
    setSelectedSort(value);
  };

  useEffect(() => {
    store.checkAuth();
    const urlObj = new URL(store.urlPosts);

    urlObj.searchParams.get("filter")
      ? urlObj.searchParams.set("filter", "of_user")
      : urlObj.searchParams.append("filter", "of_user");

    handleSortSelect("Ваши посты");
    store.setUrlPosts(urlObj);

    return () => {
      const urlObj = new URL(store.urlPosts);
      urlObj.search = "";
      store.setUrlPosts(urlObj.toString());
    };
  }, []);

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

  const displayName = store.user?.first_name
    ? `${store.user?.first_name} ${store.user?.last_name}`
    : "";

  return (
    <>
      <Head>
        <title>Личный кабинет</title>
      </Head>
      {load || !store.isAuth ? (
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
      ) : (
        <>
          <Header />
          <main className="main px-4 relative" ref={mainRef}>
            <button
              className="absolute text-main-white text-[16px] hover:underline right-4 top-4"
              onClick={() => {
                store.logout();
                window.location.href = "/";
                setLoad(true);
              }}
            >
              Выйти
            </button>
            <Link
              href="/"
              className="text-main-white text-xs mt-4 inline-block hover:underline"
              onClick={() => {
                const urlObj = store.urlPosts;

                urlObj.searchParams.delete("filter");

                store.setUrlPosts(urlObj.toString());
              }}
            >
              Назад
            </Link>
            <div className="max-w-[794px] mx-auto pt-5">
              <h1 className="text-main-white text-[32px] mb-5">
                Личный кабинет
              </h1>
              <div className="user flex gap-4">
                <div className="h-[96px] w-[96px] rounded-full overflow-hidden">
                  <Image
                    src={
                      store.user?.avatar
                        ? `http://127.0.0.1:5000${store.user?.avatar}`
                        : defaultAvatar
                    }
                    width={96}
                    height={96}
                    unoptimized
                    className="object-cover w-full h-full"
                    alt="User Avatar"
                  />
                </div>
                {displayName ? (
                  <div className="user__data">
                    <span className="text-main-white text-xl">
                      {displayName}
                    </span>
                    <span className="text-main-white text-[16px] opacity-70">
                      username: {store.user?.username}
                    </span>
                    <Link
                      href="/users/change/"
                      className="text-[16px] ml-3 text-main-white hover:underline mt-1 opacity-60"
                    >
                      Редактировать профиль
                    </Link>
                  </div>
                ) : (
                  <div className="user__data">
                    <span className="text-main-white text-[16px]">
                      username: {store.user?.username}
                    </span>
                    <Link
                      href="/users/change/"
                      className="text-[14px] text-main-white mt-1 underline opacity-60 hover:underline"
                    >
                      Редактировать профиль
                    </Link>
                  </div>
                )}
              </div>
              <div className="relative inline-block text-xs">
                <button
                  onClick={() => {
                    setShowSortDropdown((lastValue) => {
                      return !lastValue;
                    });
                  }}
                  className="filter"
                >
                  {selectedSort} <ArrowIconDown />
                </button>
                {showSortDropdown && (
                  <div className="filter__show">
                    <div
                      className={clsx(
                        "filter__show-part",
                        selectedSort === "Ваши посты"
                          ? "filter__show-part--selected"
                          : "bg-transparent"
                      )}
                      onClick={() => {
                        handleSortSelect("Ваши посты");
                        const urlObj = new URL(store.urlPosts);

                        urlObj.searchParams.get("filter")
                          ? urlObj.searchParams.set("filter", "of_user")
                          : urlObj.searchParams.append("filter", "of_user");

                        store.setUrlPosts(urlObj);
                      }}
                    >
                      Ваши посты
                    </div>
                    <div
                      className={clsx(
                        "filter__show-part",
                        selectedSort === "Понравившееся"
                          ? "filter__show-part--selected"
                          : "bg-transparent"
                      )}
                      onClick={() => {
                        handleSortSelect("Понравившееся");
                        const urlObj = new URL(store.urlPosts);

                        urlObj.searchParams.get("filter")
                          ? urlObj.searchParams.set("filter", "liked")
                          : urlObj.searchParams.append("filter", "liked");

                        store.setUrlPosts(urlObj);
                      }}
                    >
                      Понравившееся
                    </div>
                    <div
                      className={clsx(
                        "filter__show-part",
                        selectedSort === "Избранные"
                          ? "filter__show-part--selected"
                          : "bg-transparent"
                      )}
                      onClick={() => {
                        handleSortSelect("Избранные");
                        const urlObj = new URL(store.urlPosts);

                        urlObj.searchParams.get("filter")
                          ? urlObj.searchParams.set("filter", "favorites")
                          : urlObj.searchParams.append("filter", "favorites");

                        store.setUrlPosts(urlObj);
                      }}
                    >
                      Избранные
                    </div>
                  </div>
                )}
              </div>
              <Link
                href="/posts/create"
                className="text-main-white text-[14px] hover:underline opacity-60"
              >
                Создать пост
              </Link>
              <div className="bg-main-white w-[100%] h-[1px] mb-4"></div>
            </div>
            <PostsList url="http://127.0.0.1:5000/posts/?filter=of_user" />
          </main>
        </>
      )}
    </>
  );
});

export default UserDetail;
