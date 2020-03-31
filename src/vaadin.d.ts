declare const VAADIN_THEME: "lumo" | "material";

interface VGridScope<T> {
  /** Number representing the row index */
  readonly index: number;

  /** Number of the tree sublevel of the item, first level-items have 0 */
  readonly level: number;

  /** Data object (provided by a data provider / items array) */
  readonly item: T;

  /** True if the item is selected (can be two-way bound) */
  selected: boolean;

  /** True if the item has row details opened (can be two-way bound) */
  detailsOpened: boolean;

  /** True if the item has tree sublevel expanded (can be two-way bound) */
  expanded: boolean;
}

interface VGridColumn<T> {
  width?: string;
  header?: string;
  flexGrow?: 0 | 1;
  textAlign?: "start" | "center" | "right";
  autoWidth?: boolean;
  headerRenderer?: (root: HTMLElement) => void;
  renderer?: (root: HTMLElement, state: any, scope: VGridScope<T>) => void;
}

type VGridDataProvider<T> = (
  params: {
    page: number;
    pageSize: number;
  },
  callback: (items: T[], total: number) => void
) => void;

type VaadinNotification = HTMLElement & {
  renderer: (r: HTMLElement, n: VaadinNotification) => void;
  duration: number | null | undefined;
  opened: boolean;
  close: () => void;
  open: () => void;
};

type VaadinDialog = HTMLElement & {
  renderer: (r: HTMLElement, d: VaadinDialog) => any;
  opened: boolean;
};

interface VaadinDatePickerI18n {
  // An array with the full names of months starting
  // with January.
  monthNames: string[];

  // An array of weekday names starting with Sunday. Used
  // in screen reader announcements.
  weekdays: string[];

  // An array of short weekday names starting with Sunday.
  // Displayed in the calendar.
  weekdaysShort: string[];

  // An integer indicating the first day of the week
  // (0 = Sunday, 1 = Monday, etc.).
  firstDayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;

  // Used in screen reader announcements along with week
  // numbers, if they are displayed.
  week: string;

  // Translation of the Calendar icon button title.
  calendar: string;

  // Translation of the Clear icon button title.
  clear: string;

  // Translation of the Today shortcut button text.
  today: string;

  // Translation of the Cancel button text.
  cancel: string;

  // A function to format given `Object` as
  // date string. Object is in the format `{ day: ..., month: ..., year: ... }`
  // Note: The argument month is 0-based. This means that January = 0 and December = 11.
  formatDate?: (date: { day: number; month: number; year: number }) => string;

  // A function to parse the given text to an `Object` in the format `{ day: ..., month: ..., year: ... }`.
  // Must properly parse (at least) text formatted by `formatDate`.
  // Setting the property to null will disable keyboard input feature.
  // Note: The argument month is 0-based. This means that January = 0 and December = 11.
  parseDate: (
    text: string
  ) => {
    day: number;
    month: number;
    year: number;
  };

  // A function to format given `monthName` and
  // `fullYear` integer as calendar title string.
  formatTitle: (monthName: string, fullYear: number) => string;
}
