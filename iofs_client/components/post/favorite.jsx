import clsx from "clsx";
import { FavoriteIcon } from "./icons";

export function Favorite({ className }) {
  return <FavoriteIcon className={clsx("absolute", className)} />;
}
