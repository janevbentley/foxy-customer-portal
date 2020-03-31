import { Messages } from "../types";

/**
 * Pluralizes the given word. Pure magic aka Russian grammar.
 *
 * @param n A number to find the correct word form for.
 * @param accP Plural accusative form of the word.
 * @param genP Plural genitive form of the word.
 * @param accS Singular accusative form of the word.
 */
function pluralize(n: number, accP: string, genP: string, accS: string) {
  const p1 = n % 10;
  const p2 = n % 100;

  if (p1 === 0 || (p1 > 4 && p1 < 10) || (p2 > 10 && p2 < 15)) return genP;
  return p1 > 1 && p1 < 5 ? accP : accS;
}

function toLocaleDateString(date: Date) {
  return date.toLocaleDateString("ru", {
    year: "numeric",
    month: "short",
    day: "2-digit"
  });
}

export const messages: Messages = {
  duration: "Даты",
  frequency: "Период",
  picker: "Следующий платеж",
  actions: "Действия",
  next: "Старые",
  previous: "Новые",
  update: "Настроить",
  cancel: "Отказаться",
  pickerI18n: {
    monthNames: [
      "Январь",
      "Февраль",
      "Март",
      "Апрель",
      "Май",
      "Июнь",
      "Июль",
      "Август",
      "Сентябрь",
      "Октябрь",
      "Ноябрь",
      "Декабрь"
    ],
    weekdays: [
      "Воскресенье",
      "Понедельник",
      "Вторник",
      "Среда",
      "Четверг",
      "Пятница",
      "Суббота"
    ],
    weekdaysShort: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
    firstDayOfWeek: 1,
    week: "Неделя",
    calendar: "Календарь",
    clear: "Очистить",
    today: "Сегодня",
    cancel: "Отменить",
    parseDate: null,
    formatTitle: (month, year) => `${month}, ${year}`,
    formatDate: ({ day, month, year }) => {
      const date = new Date(year, month, day);
      return toLocaleDateString(date);
    }
  },
  close: "Закрыть",
  error:
    "Кажется, у нас что-то сломалось. Пожалуйста, попробуйте еще раз или напишите нам.",
  confirmOK: "Да",
  confirmCancel: "Нет",
  confirmText: (newValue, oldValue) => {
    if (newValue.next_transaction_date !== oldValue.next_transaction_date) {
      const date = toLocaleDateString(new Date(newValue.next_transaction_date));
      return `Следующее списание произойдет ${date}. Сохранить?`;
    } else if (newValue.frequency !== oldValue.frequency) {
      const period = messages.frequencyDescription(newValue.frequency);
      return `Оплата подписки будет списываться ${period.toLowerCase()}. Сохранить?`;
    } else {
      return "Сохранить изменения?";
    }
  },
  updateSuccess: "Подписка обновлена",
  statusDescription: item => {
    const start = toLocaleDateString(new Date(item.start_date));
    if (item.end_date === null) return `С ${start}`;

    const end = toLocaleDateString(new Date(item.end_date));
    return `С ${start} по ${end}`;
  },
  frequencyDescription: value => {
    if (value === ".5m") return "Два раза в месяц";

    const count = parseInt(value.substr(0, value.length - 1));
    const period = value[value.length - 1];

    if (!["y", "m", "w", "d"].includes(period)) return value;

    return {
      y: (n: number) => `Раз в ${n} ${pluralize(n, "года", "лет", "год")}`,
      m: (n: number) =>
        `Раз в ${n} ${pluralize(n, "месяца", "месяцев", "месяц")}`,
      w: (n: number) =>
        `Раз в ${n} ${pluralize(n, "недели", "недель", "неделю")}`,
      d: (n: number) => `Раз в ${n} ${pluralize(n, "дня", "дней", "день")}`
    }[period](count);
  }
};
