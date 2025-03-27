import { SearchIcon } from "./icons";
import { useContext, useRef } from "react";
import { ApiUrlContext } from "../../pages/index";

import { Button } from "../button";

export function Header() {
  return (
    <header className="header">
      <span className="logo">iofs</span>
      <InputHeader />
      <Button>Войти</Button>
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
