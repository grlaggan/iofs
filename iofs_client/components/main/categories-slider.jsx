import { useEffect, useState, useRef, useContext } from "react";
import { CategoryBlock } from "./category-block";
import { ArrowIconRight, ArrowIconLeft } from "./icons";
import UserService from "../services/user_service";
import clsx from "clsx";
import { Context } from "../../pages/_app";
import gsap from "gsap";

export function CategoriesSlider({ categoriesData, setCategoriesData }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const blocksRef = useRef([]);
  const { store } = useContext(Context);

  const slider = useRef(null);

  const moveToBlock = (index) => {
    blocksRef.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "end",
    });
  };

  useEffect(() => {
    blocksRef.current = blocksRef.current.slice(0, categoriesData.length);
  }, [categoriesData]);

  useEffect(() => {
    moveToBlock(currentIndex);
  }, [currentIndex]);

  const nextBlock = () => {
    let currentIndexSub = currentIndex;
    for (let i = 3; i > 0; --i) {
      if (currentIndexSub + 1 > categoriesData.length) {
        continue;
      }

      currentIndexSub += i;
      break;
    }

    const nextIndex = Math.min(currentIndexSub, categoriesData.length - 1);
    setCurrentIndex(nextIndex);
  };

  const prevBlock = () => {
    let currentIndexSub = currentIndex;
    const prevIndex = Math.max(currentIndexSub - 3, 0);
    setCurrentIndex(prevIndex);
  };

  const categoriesApiUrl = "http://127.0.0.1:5000/post_categories/";

  useEffect(() => {
    UserService.getItems(categoriesApiUrl).then((result) => {
      setCategoriesData(result.data);
      console.log(categoriesData);
      store.setCategories(result.data);
    });
  }, []);

  useEffect(() => {
    gsap.fromTo(
      slider.current,
      {
        opacity: 0,
      },
      {
        opacity: 1,
        duration: 2,
      }
    );
  }, []);

  return (
    <div className="relative h-[228px]" ref={slider}>
      <button
        className={clsx(
          "category-block__scroll-next",
          currentIndex > 9 && "opacity-0"
        )}
        onClick={nextBlock}
      >
        <ArrowIconRight />
      </button>
      <button
        className={clsx(
          "category-block__scroll-prev",
          currentIndex < 3 && "opacity-0"
        )}
        onClick={prevBlock}
        hidden={currentIndex === 0}
      >
        <ArrowIconLeft />
      </button>
      <div className="category-blocks">
        {categoriesData.map((categoryData, index) => (
          <CategoryBlock
            key={categoryData.id}
            image={categoryData.image}
            categoryName={categoryData.name}
            blocksRef={blocksRef}
            refBlock={(el) => (blocksRef.current[index] = el)}
          />
        ))}
      </div>
    </div>
  );
}
