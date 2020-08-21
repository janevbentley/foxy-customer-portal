import { Messages } from "../types";

export const messages: Messages = {
  ok: "OK",
  close: "Cau",
  cancel: "Canslo",
  amex: "Logo American Express.",
  diners: "Logo Diners Club.",
  discover: "Logo Discover.",
  jcb: "Logo JCB.",
  maestro: "Logo Maestro.",
  mastercard: "Logo MasterCard.",
  visa: "Logo Visa.",
  unknown: "Delwedd card generig.",
  ccNumber: "Y 4 digid olaf o'ch rhif cardyn:",
  ccUpdateFailed: "Diweddaru cardyn",
  ccRegion: "Modd o dalu",
  ccEdit: "Addasu manylion cardyn.",
  items: "Eitemau a gynwyswyd",
  receipt: "Derbyneb",
  failed: "Methodd",
  active: "Cyfredol",
  cancelled: "Canslwyd",
  transactions: "Trafodion yn ymwneud â'r tanysgrifiad hwn",
  productLinkTitle:
    "Dilynwch y ddolen hon i ddysgu mwy am yr eitem yma (yn agor mewn tab newydd).",
  productImageAlt: "Llun o'r eitem.",
  status: "Statws",
  amount: "Swm",
  timestamp: "Dyddiad",
  id: "ID",
  links: "Dolenni",
  error: "Gwall taliad",
  loadMore: "Llwytho mwy",
  selectNextDate: "Dewisiwch y dyddiad nesaf",
  selectFrequency: "Dewisiwch amlder",
  cancelSubscription: "Canslo tanysgrifiad",
  updateNotification: "Diweddarwyd y danysgrifiad.",
  errorNotification:
    "Mae gwall anhysbys wedi digwydd. Rhowch gynnig arall arni yn nes ymlaen neu cysylltwch â ni am help..",

  date: date => {
    return new Date(date).toLocaleDateString("en", {
      month: "long",
      day: "numeric"
    });
  },

  year: date => {
    return new Date(date).toLocaleDateString("en", {
      year: "numeric"
    });
  },

  price: (value, currency) => {
    return value.toLocaleString("en", {
      style: "currency",
      minimumFractionDigits: 0,
      currency
    });
  },

  summary: items => {
    const { name } = [...items].sort((a, b) => a.price - b.price).pop();
    return `${name}${items.length > 1 ? ` + ${items.length - 1} more` : ""}`;
  },

  productDescription: (total, currency, quantity) => {
    const formattedTotal = messages.price(total, currency);
    return `${formattedTotal} (${quantity} item${quantity > 1 ? "s" : ""})`;
  },

  statusDescription: item => {
    if (Boolean(item.first_failed_transaction_date)) {
      return `Failed on ${messages.date(item.first_failed_transaction_date)}`;
    }

    if (Boolean(item.end_date)) {
      const date = new Date(item.end_date);
      const ended = date.getTime() <= Date.now();
      return `End${ended ? "ed" : "s"} on ${messages.date(date)}`;
    }

    return `Next payment on ${messages.date(item.next_transaction_date)}`;
  },

  frequencyDescription: frequency => {
    if (frequency === ".5m") return `twice a month`;

    const count = parseInt(frequency.substr(0, frequency.length - 1));
    const period = frequency[frequency.length - 1];

    if (!["y", "m", "w", "d"].includes(period)) return frequency;

    return {
      y: (n: number) => (n > 1 ? `${n} years` : "year"),
      m: (n: number) => (n > 1 ? `${n} months` : "month"),
      w: (n: number) => (n > 1 ? `${n} weeks` : "week"),
      d: (n: number) => (n > 1 ? `${n} days` : "day")
    }[period](count);
  },

  nextDateConfirm: date =>
    `Change your next billing date to ${messages.date(date)}?`,

  frequencyConfirm: value =>
    `Change frequency to ${messages.frequencyDescription(value)}?`
};
