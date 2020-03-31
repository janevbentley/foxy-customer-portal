/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * A transaction is a historical record of a cart that has been purchased by a customer. To create a transaction, you post to a cart. The only aspects of a transaction which can be modified are hide_transaction and data_is_fed.
 */
export type Transaction = {
  /**
   * Full creation date (ISO format).
   */
  date_created: string;
  /**
   * Full modification date (ISO format).
   */
  date_modified: string;
} & {
  /**
   * Useful resource pointers.
   */
  _links: {
    /**
     * Link to this resource.
     */
    self: {
      /**
       * A few words describing where this link points.
       */
      title: string;
      /**
       * An absolute URL of the resource.
       */
      href: string;
      /**
       * Link type (optional, value depending on the context).
       */
      type?: string;
    };
    /**
     * Link to the first resource.
     */
    first?: {
      /**
       * A few words describing where this link points.
       */
      title: string;
      /**
       * An absolute URL of the resource.
       */
      href: string;
      /**
       * Link type (optional, value depending on the context).
       */
      type?: string;
    };
    /**
     * Link to the previous resource.
     */
    prev?: {
      /**
       * A few words describing where this link points.
       */
      title: string;
      /**
       * An absolute URL of the resource.
       */
      href: string;
      /**
       * Link type (optional, value depending on the context).
       */
      type?: string;
    };
    /**
     * Link to next resource.
     */
    next?: {
      /**
       * A few words describing where this link points.
       */
      title: string;
      /**
       * An absolute URL of the resource.
       */
      href: string;
      /**
       * Link type (optional, value depending on the context).
       */
      type?: string;
    };
    /**
     * Link to last resource.
     */
    last?: {
      /**
       * A few words describing where this link points.
       */
      title: string;
      /**
       * An absolute URL of the resource.
       */
      href: string;
      /**
       * Link type (optional, value depending on the context).
       */
      type?: string;
    };
  } & {
    /**
     * A named resource link of a particular type.
     */
    "fx:receipt": {
      /**
       * A few words describing where this link points.
       */
      title: string;
      /**
       * An absolute URL of the resource.
       */
      href: string;
      /**
       * Link type (optional, value depending on the context).
       */
      type?: string;
    };
  };
  _embedded: {
    "fx:attributes": ({
      /**
       * Full creation date (ISO format).
       */
      date_created: string;
      /**
       * Full modification date (ISO format).
       */
      date_modified: string;
    } & {
      /**
       * Attribute name.
       */
      name: string;
      /**
       * Attribute value.
       */
      value: string;
      /**
       * Public availability of this attribute.
       */
      visibility: "public" | "private";
    })[];
  };
  /**
   * The order number.
   */
  id: number;
  /**
   * The order number for display.
   */
  display_id: number;
  /**
   * True if this transaction was a test transaction and not run against a live payment gateway.
   */
  is_test: boolean;
  /**
   * Set this to true to hide it in the FoxyCart admin.
   */
  hide_transaction: boolean;
  /**
   * If the webhook for this transaction has been successfully sent, this will be true. You can also modify this to meet your needs.
   */
  data_is_fed: boolean;
  /**
   * The date of this transaction shown in the timezone of the store. The format used is ISO 8601 (or 'c' format string for PHP developers).
   */
  transaction_date: string;
  /**
   * The locale code of this transaction. This will be a copy of the store's local_code at the time of the transaction.
   */
  locale_code: string;
  /**
   * The customer's given name at the time of the transaction.
   */
  customer_first_name: string;
  /**
   * The customer's surname at the time of the transaction.
   */
  customer_last_name: string;
  /**
   * If the customer provided a tax_id during checkout, it will be included here.
   */
  customer_tax_id: string;
  /**
   * The customer's email address at the time of the transaction.
   */
  customer_email: string;
  /**
   * The customer's ip address at the time of the transaction.
   */
  customer_ip: string;
  /**
   * The country of the customer's ip address.
   */
  ip_country: string;
  /**
   * User Agent string.
   */
  user_agent: string;
  /**
   * Total amount of the items in this transaction.
   */
  total_item_price: number;
  /**
   * Total amount of the taxes for this transaction.
   */
  total_tax: number;
  /**
   * Total amount of the shipping costs for this transaction.
   */
  total_shipping: number;
  /**
   * If this transaction has any shippable subscription items which will process in the future, this will be the total amount of shipping costs for those items.
   */
  total_future_shipping: number;
  /**
   * Total amount of this transaction including all items, taxes, shipping costs and discounts.
   */
  total_order: number;
  /**
   * ISO 4217 currency code, uppercase.
   */
  currency_code: string;
  /**
   * A text symbol representing the currency this transaction was made in.
   */
  currency_symbol: string;
  /**
   * Used for transactions processed with a hosted payment gateway which can change the status of the transaction after it is originally posted. If the status is empty, a normal payment gateway was used and the transaction should be considered completed.
   */
  status:
    | ""
    | "captured"
    | "approved"
    | "authorized"
    | "declined"
    | "pending"
    | "rejected";
};