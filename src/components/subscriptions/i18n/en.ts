import { Messages } from "../types";

function toLocaleDateString(date: Date) {
  return date.toLocaleDateString("en", {
    year: "numeric",
    month: "short",
    day: "2-digit"
  });
}

export const messages: Messages = {
  duration: "Duration",
  frequency: "Frequency",
  picker: "Next payment",
  actions: "Actions",
  next: "Older",
  previous: "Newer",
  update: "Update",
  cancel: "End",
  pickerI18n: {
    monthNames: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ],
    weekdays: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ],
    weekdaysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    firstDayOfWeek: 0,
    week: "Week",
    calendar: "Calendar",
    clear: "Clear",
    today: "Today",
    cancel: "Cancel",
    parseDate: null,
    formatTitle: (month, year) => `${month}, ${year}`,
    formatDate: ({ day, month, year }) => {
      const date = new Date(year, month, day);
      return toLocaleDateString(date);
    }
  },
  close: "Close",
  error:
    "An unknown error has occurred. Please try again later or contact us for help.",
  confirmOK: "OK",
  confirmCancel: "Cancel",
  confirmText: (newValue, oldValue) => {
    if (newValue.next_transaction_date !== oldValue.next_transaction_date) {
      const date = toLocaleDateString(new Date(newValue.next_transaction_date));
      return `Change your next billing date to ${date}?`;
    } else if (newValue.frequency !== oldValue.frequency) {
      const period = messages.frequencyDescription(newValue.frequency);
      return `Change your billing period to ${period}?`;
    } else {
      return "Save changes?";
    }
  },
  updateSuccess: "Subscription updated",
  statusDescription: item => {
    const start = toLocaleDateString(new Date(item.start_date));
    const end =
      item.end_date === null
        ? "now"
        : toLocaleDateString(new Date(item.end_date));

    return `${start} – ${end}`;
  },
  frequencyDescription: value => {
    if (value === ".5m") return "Twice a month";

    const count = parseInt(value.substr(0, value.length - 1));
    const period = value[value.length - 1];

    if (!["y", "m", "w", "d"].includes(period)) return value;

    return {
      y: (n: number) => (n > 1 ? `Every ${n} years` : "Yearly"),
      m: (n: number) => (n > 1 ? `Every ${n} months` : "Monthly"),
      w: (n: number) => (n > 1 ? `Every ${n} weeks` : "Weekly"),
      d: (n: number) => (n > 1 ? `Every ${n} days` : "Daily")
    }[period](count);
  }
};
