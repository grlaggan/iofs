import clsx from "clsx";
import { FavoriteIcon, LikeIcon, ArrowIconDown } from "./icons";
import defaultAvatar from "./images/default-avatar.png";
import Image from "next/image";
import Link from "next/link";

export function Post({
  category,
  theme,
  description,
  likes,
  creator,
  created,
}) {
  return (
    <div className="post flex flex-col gap-2 mt-2">
      <div className="flex gap-2 items-center">
        <div className="w-6 h-6 rounded-full overflow-hidden">
          <Image
            src={
              creator.avatar
                ? `http://127.0.0.1:5000${creator.avatar}`
                : defaultAvatar
            }
            width={24}
            height={24}
            unoptimized
            className="object-cover w-full h-full"
          />
        </div>
        <span className="post__username">
          {creator.last_name && creator.first_name
            ? clsx(creator.first_name, creator.last_name)
            : creator.username}
        </span>
        <span className="post__created">{formatTimeAgo(created)}</span>
      </div>
      <div className="post-wrapper">
        <FavoriteIcon className="post__favorite-icon" />
        <span>Категория: {category}</span>
        <span className="text-xs">Тема: {theme}</span>
        <span className="text-xs">Описание: {description}</span>
        <div className="flex justify-between mt-auto items-center">
          <Link href="#" className="flex gap-2">
            <LikeIcon />
            <span>{likes}</span>
          </Link>
          <div className="flex gap-[5px] items-center">
            <Link href="#" className="post-wrapper__full-view">
              Полное содержание
            </Link>
            <ArrowIconDown />
          </div>
        </div>
      </div>
    </div>
  );
}

function formatTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  const intervals = {
    год: 31536000,
    месяц: 2592000,
    неделя: 604800,
    день: 86400,
    час: 3600,
    минута: 60,
    секунда: 1,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${getProperUnit(unit, interval)} назад`;
    }
  }

  return "только что";
}

function getProperUnit(unit, count) {
  const units = {
    год: ["год", "года", "лет"],
    месяц: ["месяц", "месяца", "месяцев"],
    неделя: ["неделя", "недели", "недель"],
    день: ["день", "дня", "дней"],
    час: ["час", "часа", "часов"],
    минута: ["минута", "минуты", "минут"],
    секунда: ["секунда", "секунды", "секунд"],
  };

  const cases = [2, 0, 1, 1, 1, 2];
  return units[unit][
    count % 100 > 4 && count % 100 < 20 ? 2 : cases[Math.min(count % 10, 5)]
  ];
}
