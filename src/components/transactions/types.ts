export interface Messages {
  /** Table header for the ID column. */
  id: string;

  /** Table header for the transaction date column. */
  date: string;

  /** Caption for button that loads older items. */
  next: string;

  /** Error overlay action text. */
  close: string;

  /** Generic error message. */
  error: string;

  /** Table header for the order total column. */
  total: string;

  /** Table header for the receipt link column. */
  receipt: string;

  /** Caption for button that loads newer items. */
  previous: string;

  /** Receipt link text. */
  receiptLink: string;
}
