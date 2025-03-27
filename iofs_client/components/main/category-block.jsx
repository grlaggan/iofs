import Link from "next/link";

export function CategoryBlock({ image, categoryName, refBlock }) {
  return (
    <Link href="#" className="category-block" ref={refBlock}>
      <img src={image} alt={categoryName} />
      <span className="category-block__name">{categoryName}</span>
    </Link>
  );
}
