import Image from "next/image";
import { useContext } from "react";
import { ApiUrlContext } from "../../pages/_app";

export function CategoryBlock({ image, categoryName, refBlock }) {
  const { setUrlForGetPosts } = useContext(ApiUrlContext);

  return (
    <div
      href="#"
      className="category-block cursor-pointer"
      ref={refBlock}
      onClick={() => {
        setUrlForGetPosts((lastUrl) => {
          const urlObj = new URL(lastUrl);
          urlObj.searchParams.get("category")
            ? urlObj.searchParams.set("category", categoryName)
            : urlObj.searchParams.append("category", categoryName);
          return urlObj.toString();
        });
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
