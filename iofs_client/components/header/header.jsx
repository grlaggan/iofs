import { SearchIcon } from "./icons";
import { useContext, useEffect, useRef } from "react";
import { Blurred } from "../../pages/_app";
import Link from "next/link";
import Image from "next/image";
import defaultAvatar from "../post/images/default-avatar.png";
import { Context } from "../../pages/_app";
import { Button } from "../button";
import { observer } from "mobx-react-lite";
import { RegContext } from "../../pages/_app";
import gsap from "gsap";
import clsx from "clsx";

export const Header = observer(() => {
  const { isAuthorization, setIsAuthorization } = useContext(Blurred);
  const { setIsAuthProcess } = useContext(RegContext);
  const { store } = useContext(Context);

  const header = useRef(null);
  const userBlock = useRef(null);
  const inputHeader = useRef(null);
  const logo = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        userBlock.current,
        {
          x: 20,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          duration: 0.5,
        }
      );
      gsap.fromTo(
        inputHeader.current,
        {
          y: -50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
        }
      );
    }, header.current);
    gsap.fromTo(
      logo.current,
      {
        x: -20,
        opacity: 0,
      },
      {
        x: 0,
        opacity: 1,
        duration: 0.5,
      }
    );
    return () => ctx.revert();
  }, []);

  return (
    <header
      className={clsx("header", isAuthorization && "blurred")}
      ref={header}
    >
      <span className="logo" ref={logo}>
        iofs
      </span>
      <InputHeader ref={inputHeader} />

      <div ref={userBlock}>
        {store.isAuth ? (
          <Link
            href={`/users/${store.user?.id}`}
            className="flex items-center profile"
          >
            <span className="text-main-white hover:underline">
              Личный кабинет
            </span>
          </Link>
        ) : (
          <Button
            onClick={() => {
              setIsAuthorization(true);
              setIsAuthProcess(true);
            }}
          >
            Войти
          </Button>
        )}
      </div>
    </header>
  );
});

function InputHeader({ ref }) {
  const inputRef = useRef(null);
  const { store } = useContext(Context);

  return (
    <div className="header__input" ref={ref}>
      <label htmlFor="posts-search-input" className="header__input-icon">
        <SearchIcon width="15" height="15" />
      </label>
      <input
        ref={inputRef}
        type="text"
        id="posts-search-input"
        placeholder="Search"
        autoComplete="off"
        onChange={() => {
          const urlObj = new URL(store.urlPosts);

          urlObj.searchParams.get("theme")
            ? urlObj.searchParams.set("theme", inputRef.current.value)
            : urlObj.searchParams.append("theme", inputRef.current.value);

          store.setUrlPosts(urlObj.toString());
        }}
      />
    </div>
  );
}
