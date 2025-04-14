import clsx from "clsx";
import { useState, useContext } from "react";
import { ArrowIconDown } from "../post/icons";
import { Context } from "../../pages/_app";

export function Filter({ categories }) {
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [selectedSort, setSelectedSort] = useState("По дате создания");
  const [showCategoryDropdown, setCategorySortDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Все");

  const { store } = useContext(Context);

  const setUrlFilterData = () => {
    const urlObj = new URL(store.urlPosts);

    urlObj.searchParams.get("filter")
      ? urlObj.searchParams.set("filter", "new")
      : urlObj.searchParams.append("filter", "new");
    return urlObj.toString();
  };

  const setUrlFilterLikes = () => {
    const urlObj = new URL(store.urlPosts);

    urlObj.searchParams.get("filter")
      ? urlObj.searchParams.set("filter", "likes")
      : urlObj.searchParams.append("filter", "likes");
    return urlObj.toString();
  };

  const handleSortSelect = (value) => {
    setShowSortDropdown(false);
    setSelectedSort(value);
  };

  const handleCategorySelect = (value) => {
    setCategorySortDropdown(false);
    setSelectedCategory(value);
  };

  return (
    <div className="flex filter-wrapper">
      <div className="relative inline-block text-xs">
        <button
          onClick={() => {
            setShowSortDropdown((lastValue) => {
              setCategorySortDropdown(false);
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
                selectedSort === "По дате создания"
                  ? "filter__show-part--selected"
                  : "bg-transparent"
              )}
              onClick={() => {
                handleSortSelect("По дате создания");
                const url = setUrlFilterData();
                store.setUrlPosts(url);
              }}
            >
              По дате создания
            </div>
            <div
              className={clsx(
                "filter__show-part",
                selectedSort === "По количеству лайков"
                  ? "filter__show-part--selected"
                  : "bg-transparent"
              )}
              onClick={() => {
                handleSortSelect("По количеству лайков");
                const url = setUrlFilterLikes();
                store.setUrlPosts(url);
              }}
            >
              По количеству лайков
            </div>
          </div>
        )}
      </div>
      <div className="relative inline-block text-xs">
        <button
          onClick={() =>
            setCategorySortDropdown((lastValue) => {
              setShowSortDropdown(false);
              return !lastValue;
            })
          }
          className="filter"
        >
          {selectedCategory} <ArrowIconDown />
        </button>
        {showCategoryDropdown && (
          <div className="filter__show">
            <div
              className={clsx(
                "filter__show-part",
                selectedCategory === "Все"
                  ? "filter__show-part--selected"
                  : "bg-transparent"
              )}
              onClick={() => {
                handleCategorySelect("Все");

                let urlObj = new URL(store.urlPosts);
                urlObj.searchParams.delete("category");

                urlObj = urlObj.toString();

                store.setUrlPosts(urlObj);
              }}
            >
              Все
            </div>
            {categories.map((category) => (
              <div
                className={clsx(
                  "filter__show-part",
                  selectedCategory === category.name
                    ? "filter__show-part--selected"
                    : "bg-transparent"
                )}
                onClick={() => {
                  handleCategorySelect(category.name);

                  let urlObj = new URL(store.urlPosts);
                  urlObj.searchParams.get("category")
                    ? urlObj.searchParams.set("category", category.name)
                    : urlObj.searchParams.append("category", category.name);

                  urlObj = urlObj.toString();

                  store.setUrlPosts(urlObj);
                }}
                key={category.id}
              >
                {category.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
