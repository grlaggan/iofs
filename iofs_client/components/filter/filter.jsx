import clsx from "clsx";
import { useState, useContext } from "react";
import { ArrowIconDown } from "../post/icons";
import { ApiUrlContext } from "../../pages";

export function Filter({ categories }) {
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [selectedSort, setSelectedSort] = useState("По дате создания");
  const [showCategoryDropdown, setCategorySortDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Все");

  const { setUrlForGetPosts } = useContext(ApiUrlContext);

  const handleSortSelect = (value) => {
    setShowSortDropdown(false);
    setSelectedSort(value);
  };

  const handleCategorySelect = (value) => {
    setCategorySortDropdown(false);
    setSelectedCategory(value);
  };

  return (
    <div className="flex ml-[100px]">
      <div className="relative filter-wrapper inline-block text-xs">
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
                setUrlForGetPosts((lastUrl) => {
                  const urlObj = new URL(lastUrl);

                  urlObj.searchParams.get("filter")
                    ? urlObj.searchParams.set("filter", "new")
                    : urlObj.searchParams.append("filter", "new");
                  return urlObj.toString();
                });
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
                setUrlForGetPosts((lastUrl) => {
                  const urlObj = new URL(lastUrl);

                  urlObj.searchParams.get("filter")
                    ? urlObj.searchParams.set("filter", "likes")
                    : urlObj.searchParams.append("filter", "likes");
                  return urlObj.toString();
                });
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
                setUrlForGetPosts((lastUrl) => {
                  const urlObj = new URL(lastUrl);

                  urlObj.searchParams.delete("category");
                  return urlObj.toString();
                });
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
                  setUrlForGetPosts((lastUrl) => {
                    const urlObj = new URL(lastUrl);
                    urlObj.searchParams.get("category")
                      ? urlObj.searchParams.set("category", category.name)
                      : urlObj.searchParams.append("category", category.name);
                    return urlObj.toString();
                  });
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
