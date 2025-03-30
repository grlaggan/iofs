import { CategoriesSlider } from "./categories-slider";
import { PostsList } from "./posts-list";
import { Filter } from "../filter";
import { useState } from "react";
import { ApiUrlContext } from "../../pages/_app";
import { useContext } from "react";

export function Main() {
  const [categoriesData, setCategoriesData] = useState([]);
  // const { setUrlForGetPosts } = useContext(ApiUrlContext);
  // setUrlForGetPosts(() => "http://127.0.0.1:5000/posts/");

  return (
    <main className="main">
      <CategoriesSlider
        categoriesData={categoriesData}
        setCategoriesData={setCategoriesData}
      />
      <Filter categories={categoriesData} />
      <div className="line"></div>
      <PostsList />
    </main>
  );
}
