import { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";
import { Header } from "../../components/header";
import Image from "next/image";
import Link from "next/link";
import defaultAvatar from "../../components/post/images/default-avatar.png";
import { ApiUrlContext } from "../_app";
import { ArrowIconDown } from "../../components/post/icons";
import { PostsList } from "../../components/main/posts-list";
import { useApi } from "../../components/user-logic/api";
import clsx from "clsx";
import { useAuth } from "../../components/user-logic/auth-context";

export default function UserDetail() {
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [selectedSort, setSelectedSort] = useState("Ваши посты");
  const { makeRequest } = useApi();
  const { dispatch } = useAuth();

  const { setUrlForGetPosts } = useContext(ApiUrlContext);

  const handleSortSelect = (value) => {
    setShowSortDropdown(false);
    setSelectedSort(value);
  };

  const router = useRouter();
  const userID = router.query.id;
  const [user, setUser] = useState({});
  const url = `http://127.0.0.1:5000/users/${userID}/`;

  useEffect(() => {
    handleSortSelect("Ваши посты");
    setUrlForGetPosts((lastUrl) => {
      const urlObj = new URL(lastUrl);

      urlObj.searchParams.get("filter")
        ? urlObj.searchParams.set("filter", "of_user")
        : urlObj.searchParams.append("filter", "of_user");
      return urlObj.toString();
    });
  }, []);

  useEffect(() => {
    if (!userID) return;

    makeRequest(url, { headers: { "Content-Type": "application/json" } })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error. ${response.status}`);
        }

        return response.json();
      })
      .then((result) => setUser(result))
      .catch(() => router.push("/"));
  }, [userID, url]);

  const avatar = user.avatar || defaultAvatar;
  const displayName = `${user.first_name} ${user.last_name}` || "";
  const username = user.username || "";

  return (
    <>
      <Header />
      <main className="main px-4 relative">
        <button
          className="absolute text-main-white text-[16px] underline right-4 top-4"
          onClick={() => {
            dispatch({ type: "LOGOUT" });
            localStorage.removeItem("refresh");
            router.push("/");
            return;
          }}
        >
          Выйти
        </button>
        <Link
          href="/"
          className="text-main-white text-xs mt-4 underline inline-block"
        >
          Назад
        </Link>
        <div className="max-w-[794px] mx-auto pt-5">
          <h1 className="text-main-white text-[32px] mb-5">Личный кабинет</h1>
          <div className="user flex gap-4">
            <div className="h-[96px] w-[96px] rounded-full overflow-hidden">
              <Image
                src={avatar}
                width={96}
                height={96}
                unoptimized
                className="object-cover w-full h-full"
                alt="User Avatar"
              />
            </div>
            {displayName ? (
              <div className="user__data">
                <span className="text-main-white text-xl">{displayName}</span>
                <span className="text-main-white text-[16px]">
                  username: {username}
                </span>
                <Link
                  href="#"
                  className="text-[16px] text-main-white underline"
                >
                  Редактировать профиль
                </Link>
              </div>
            ) : (
              <div className="user__data">
                <span className="text-main-white text-[16px]">
                  username: {username}
                </span>
                <Link
                  href="#"
                  className="text-[16px] text-main-white underline"
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
                    setUrlForGetPosts((lastUrl) => {
                      const urlObj = new URL(lastUrl);

                      urlObj.searchParams.get("filter")
                        ? urlObj.searchParams.set("filter", "of_user")
                        : urlObj.searchParams.append("filter", "of_user");
                      return urlObj.toString();
                    });
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
                    setUrlForGetPosts((lastUrl) => {
                      const urlObj = new URL(lastUrl);

                      urlObj.searchParams.get("filter")
                        ? urlObj.searchParams.set("filter", "liked")
                        : urlObj.searchParams.append("filter", "liked");
                      return urlObj.toString();
                    });
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
                    setUrlForGetPosts((lastUrl) => {
                      const urlObj = new URL(lastUrl);

                      urlObj.searchParams.get("filter")
                        ? urlObj.searchParams.set("filter", "favorites")
                        : urlObj.searchParams.append("filter", "favorites");
                      return urlObj.toString();
                    });
                  }}
                >
                  Избранные
                </div>
              </div>
            )}
          </div>
          <div className="bg-main-white w-[100%] h-[1px] mb-4"></div>
        </div>
        <PostsList url="http://127.0.0.1:5000/posts/?filter=of_user" />
      </main>
    </>
  );
}
