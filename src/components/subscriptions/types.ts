import { Subscription } from "../../assets/types/Subscription";

export interface Messages {
  /** Table header for the start date column. */
  duration: string;

  /** Table header for the subscription frequency column. */
  frequency: string;

  /** Table header for the next transaction date picker column. */
  picker: string;

  /** Table header for the actions column. */
  actions: string;

  /** Text displayed in a link to updating the payment method. */
  update: string;

  /** Subscription cancelllation link text. */
  cancel: string;

  /** Error overlay action text. */
  close: string;

  /** Generic error message. */
  error: string;

  /** Caption for button that loads older items. */
  next: string;

  /** Caption for button that loads newer items. */
  previous: string;

  /** OK button caption in the confirmation dialog. */
  confirmOK: string;

  /** Cancel button caption in the confirmation dialog. */
  confirmCancel: string;

  /** Confirmation dialog text (dynamic). */
  confirmText: (newValue: Subscription, oldValue: Subscription) => string;

  /** Next transaction date update success notification (dynamic). */
  updateSuccess: string;

  /** Long localized description for frequency periods such as 1m, 2y, 12d etc. */
  frequencyDescription: (value: string) => string;

  /** Long localized description of the subscription status. */
  statusDescription: (item: Subscription) => string;

  /** Vaadin date picker translations. */
  pickerI18n: VaadinDatePickerI18n;
}
