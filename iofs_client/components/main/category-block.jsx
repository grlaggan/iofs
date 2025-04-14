import Image from "next/image";
import { useContext } from "react";
import { Context } from "../../pages/_app";

export function CategoryBlock({ image, categoryName, refBlock }) {
  const { store } = useContext(Context);

  const setUrlWithCategory = () => {
    const urlObj = new URL(store.urlPosts);
    urlObj.searchParams.get("category")
      ? urlObj.searchParams.set("category", categoryName)
      : urlObj.searchParams.append("category", categoryName);
    return urlObj.toString();
  };

  return (
    <div
      href="#"
      className="category-block cursor-pointer hover:underline"
      ref={refBlock}
      onClick={() => {
        const url = setUrlWithCategory();
        store.setUrlPosts(url);
      }}
    >
      <Image
        src={image}
        alt={categoryName}
        width={250}
        height={180}
        unoptimized
      />
      <span className="category-block__name">{categoryName}</span>
    </div>
  );
}
