import { SearchIcon } from "./icons";
import { useContext, useRef } from "react";
import { ApiUrlContext } from "../../pages/_app";
import { Blurred } from "../../pages/_app";
import { useAuth } from "../user-logic/auth-context";
import Link from "next/link";
import Image from "next/image";
import defaultAvatar from "../post/images/default-avatar.png";

import { Button } from "../button";

export function Header() {
  const { state } = useAuth();
  const { setIsAuthorization } = useContext(Blurred);

  return (
    <header className="header">
      <span className="logo">iofs</span>
      <InputHeader />

      {state.accessToken ? (
        <Link
          href={`/users/${state.userData?.id}`}
          className="flex items-center gap-2 h-8 rounded-full overflow-hidden flex-shrink-0"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <Image
              src={
                state.userData?.avatar
                  ? `http://127.0.0.1:5000/${state.userData?.avatar}`
                  : defaultAvatar
              }
              width={32}
              height={32}
              unoptimized
              className="object-cover w-full h-full"
            />
          </div>
          <span className="header__username">
            {state.userData?.last_name
              ? `${state.userData?.first_name} ${state.userData?.last_name}`
              : `${state.userData?.username}`}
          </span>
        </Link>
      ) : (
        <Button onClick={() => setIsAuthorization((lastValue) => !lastValue)}>
          Войти
        </Button>
      )}
    </header>
  );
}

function InputHeader() {
  const inputRef = useRef(null);
  const { setUrlForGetPosts } = useContext(ApiUrlContext);

  return (
    <div className="header__input">
      <label htmlFor="posts-search-input" className="header__input-icon">
        <SearchIcon width="15" height="15" />
      </label>
      <input
        ref={inputRef}
        type="text"
        id="posts-search-input"
        placeholder="Search"
        autoComplete="off"
        onKeyDown={(event) => {
          if (event.code == "Enter") {
            setUrlForGetPosts((lastUrl) => {
              const urlObj = new URL(lastUrl);
              const getParams = new URLSearchParams(urlObj.search);

              getParams.set("theme", inputRef.current.value);

              urlObj.search = getParams.toString().split("=")[1]
                ? getParams.toString()
                : "";
              return urlObj.toString();
            });
          }
        }}
      />
    </div>
  );
}
