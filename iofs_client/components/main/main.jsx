import { CategoriesSlider } from "./categories-slider";
import { PostsList } from "./posts-list";
import { Filter } from "../filter";
import { useState } from "react";

import { ApiUrlContext } from "../../pages/index";

export function Main() {
  const [categoriesData, setCategoriesData] = useState([]);

  return (
    <main className="main">
      <CategoriesSlider
        categoriesData={categoriesData}
        setCategoriesData={setCategoriesData}
      />
      <Filter categories={categoriesData} />
      <div className="line"></div>
      <PostsList context={ApiUrlContext} />
    </main>
  );
}
