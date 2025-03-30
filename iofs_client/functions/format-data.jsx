export function formatTimeAgo(dateString) {
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
