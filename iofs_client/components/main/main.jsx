import { CategoriesSlider } from "./categories-slider";
import { PostsList } from "./posts-list";
import { Filter } from "../filter";
import { useState, useEffect, useContext, useRef } from "react";
import { Context } from "../../pages/_app";
import gsap from "gsap";

export function Main() {
  const [categoriesData, setCategoriesData] = useState([]);

  const mainRef = useRef(null);

  const { store } = useContext(Context);

  useEffect(() => {
    const urlObj = new URL(store.urlPosts);
    urlObj.search = "";
    store.setUrlPosts(urlObj.toString());

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
        y: 50,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
      }
    );
  }, []);

  return (
    <main className="main">
      <div ref={mainRef}>
        <CategoriesSlider
          categoriesData={categoriesData}
          setCategoriesData={setCategoriesData}
        />
        <Filter categories={categoriesData} />
        <div className="line"></div>
        <PostsList />
      </div>
    </main>
  );
}
