import clsx from "clsx";
import { useState } from "react";
import { ArrowIconDown } from "../post/icons";

export function Filter({ categories }) {
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [selectedSort, setSelectedSort] = useState("Новое");
  const [showCategoryDropdown, setCategorySortDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Все");

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
                selectedSort === "Новое"
                  ? "filter__show-part--selected"
                  : "bg-transparent"
              )}
              onClick={() => handleSortSelect("Новое")}
            >
              Новое
            </div>
            <div
              className={clsx(
                "filter__show-part",
                selectedSort === "Все"
                  ? "filter__show-part--selected"
                  : "bg-transparent"
              )}
              onClick={() => handleSortSelect("Все")}
            >
              Все
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
              onClick={() => handleCategorySelect("Все")}
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
                onClick={() => handleCategorySelect(category.name)}
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
