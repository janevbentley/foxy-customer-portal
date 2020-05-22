import groupNumbers from "group-numbers";
import { Messages } from "../types";
import { toLocaleList, parseDate } from "../utils";

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

const weekdays = {
  1: "понедельник",
  2: "вторник",
  3: "среда",
  4: "четверг",
  5: "пятница",
  6: "суббота",
  7: "воскресенье"
};

export const messages: Messages = {
  ok: "Сохранить",
  close: "Закрыть",
  cancel: "Отменить",
  amex: "Логотип American Express.",
  diners: "Логотип Diners Club.",
  discover: "Логотип Discover.",
  jcb: "Логотип JCB.",
  maestro: "Логотип Maestro.",
  mastercard: "Логотип MasterCard.",
  visa: "Логотип Visa.",
  unknown: "Изображение банковской карты.",
  ccNumber: "Последние 4 цифры номера карты:",
  ccUpdateFailed: "Исправить проблему",
  ccEdit: "Изменить данные карты.",
  ccRegion: "Способ оплаты",
  items: "Included items",
  receipt: "Показать чек",
  failed: "Ошибка платежа",
  active: "Успешный платеж",
  cancelled: "Подписка отменена",
  transactions: "Платежи в рамках этой подписки",
  productLinkTitle: "Перейти на страницу продукта (откроется в новой вкладке).",
  productImageAlt: "Фотография или изображение продукта.",
  status: "Состояние",
  amount: "Сумма",
  timestamp: "Дата",
  id: "Номер",
  links: "Ссылки",
  error: "Ошибка платежа",
  loadMore: "Показать еще",
  selectNextDate: "Перенести платеж",
  selectFrequency: "Изменить период",
  cancelSubscription: "Отменить подписку",
  updateNotification: "Подписка обновлена.",
  errorNotification:
    "Кажется, у нас что-то сломалось. Пожалуйста, попробуйте еще раз или напишите нам.",

  date: date => {
    return new Date(date).toLocaleDateString("ru", {
      month: "long",
      day: "numeric"
    });
  },

  year: date => {
    return new Date(date).toLocaleDateString("ru", {
      year: "numeric"
    });
  },

  price: (value, currency) => {
    return value.toLocaleString("ru", {
      style: "currency",
      minimumFractionDigits: 0,
      currency
    });
  },

  summary: items => {
    const { name } = [...items].sort((a, b) => a.price - b.price).pop();
    return `${name}${items.length > 1 ? ` + еще ${items.length - 1}` : ""}`;
  },

  productDescription: (total, currency, quantity) => {
    const formattedTotal = total.toLocaleString("ru", { currency });
    return `${formattedTotal} (количество: ${quantity})`;
  },

  statusDescription: item => {
    if (Boolean(item.first_failed_transaction_date)) {
      return `Неудачный платеж ${messages.date(
        item.first_failed_transaction_date
      )}`;
    }

    if (Boolean(item.end_date)) {
      const date = new Date(item.end_date);
      const ended = date.getTime() <= Date.now();
      return `Закончи${ended ? "лась" : "тся"} ${messages.date(date)}`;
    }

    return `Следующий платеж ${messages.date(item.next_transaction_date)}`;
  },

  frequencyDescription: frequency => {
    if (frequency === ".5m") return `дважды в месяц`;

    const count = parseInt(frequency.substr(0, frequency.length - 1));
    const period = frequency[frequency.length - 1];

    if (!["y", "m", "w", "d"].includes(period)) return frequency;

    return {
      y: (n: number) => `${n} ${pluralize(n, "года", "лет", "год")}`,
      m: (n: number) => `${n} ${pluralize(n, "месяца", "месяцев", "месяц")}`,
      w: (n: number) => `${n} ${pluralize(n, "недели", "недель", "неделю")}`,
      d: (n: number) => `${n} ${pluralize(n, "дня", "дней", "день")}`
    }[period](count);
  },

  nextDateDescription: rules => {
    let result = "";

    // days of week:  "Доступные дни недели: понедельник – среда и четверг."
    // days of month: "Доступные числа месяца: 1, 3 - 14 и 28."

    if ("allowedDays" in rules) {
      const groups = groupNumbers(rules.allowedDays.days, false);

      if (rules.allowedDays.type === "day") {
        const days = groups.map(v => v.map(day => weekdays[day]).join(" – "));
        result += `Доступные дни недели: ${toLocaleList(days, "и")}.`;
      } else {
        const dates = groups.map(v => v.join(" – "));
        result += `Доступные числа месяца: ${toLocaleList(dates, "и")}.`;
      }
    }

    // example: "Можно выбрать любой день, кроме 3 июня, 13 июня и 6 августа – 1 сентября."

    if ("disallowedDates" in rules) {
      const dates = rules.disallowedDates.map(v => {
        const range = v.split("..");
        return range.map(v => messages.date(parseDate(v))).join(" – ");
      });

      if (result.length !== 0) result += " ";
      result += `Можно выбрать любой день, кроме ${toLocaleList(dates, "и")}.`;
    }

    return result;
  },

  nextDateConfirm: date =>
    `Следующее списание произойдет ${messages.date(date)}. Сохранить?`,

  frequencyConfirm: value =>
    `Изменить частоту списания на ${messages.frequencyDescription(value)}?`
};
