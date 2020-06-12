export type StateConsumer =
  | HTMLFoxyAddressElement
  | HTMLFoxyProfileElement
  | HTMLFoxySubscriptionsElement
  | HTMLFoxyTransactionsElement;

export interface Tab {
  href: string;
  text: string;
}

export interface Messages {
  /** Salutation text. */
  greeting: (name: string) => string;

  /** "Activity" tab label. */
  activity: string;

  /** "Account" tab label. */
  account: string;

  /** "Logout" tab label. */
  logout: string;

  /** Transactions section label. */
  transactions: string;

  /** Subscriptions section label. */
  subscriptions: string;

  /** Downloads section label. */
  downloads: string;

  /** Coming soon placeholder text for Downloads section. */
  comingSoon: string;

  /** Account > Login section label. */
  loginInfo: string;
}
