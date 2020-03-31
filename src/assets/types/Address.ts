/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * An address saved for a customer.
 */
export type Address = {
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
   * The name of this address. This is also the value used as the
   * ship to entry for a multiship item.
   */
  address_name: string;
  /**
   * The given name associated with this address.
   */
  first_name: string;
  /**
   * The surname associated with this address.
   */
  last_name: string;
  /**
   * The company associated with this address.
   */
  company: string;
  /**
   * The first line of the street address.
   */
  address1: string;
  /**
   * The second line of the street address.
   */
  address2: string;
  /**
   * The city of this address.
   */
  city: string;
  /**
   * The two character code for states in the United States.
   * Other countries may call this a province. When a two character code isn't
   * available, use the full region name.
   */
  region: string;
  /**
   * The postal code of this address.
   */
  postal_code: string;
  /**
   * The country code of this address.
   */
  country: string;
  /**
   * The phone of this address.
   */
  phone: string;
  /**
   * Specifies if this address is the default billing address for the customer.
   */
  is_default_billing: boolean;
  /**
   * Specifies if this address is the default shipping address for the customer.
   */
  is_default_shipping: boolean;
};