import { PaymentMethod } from "./types/PaymentMethod";
import { Address } from "./types/Address";
import { FullGetResponse } from "../api";

export const method: () => PaymentMethod = () => ({
  save_cc: false,
  cc_type: "",
  cc_number_masked: "",
  cc_exp_month: "string",
  cc_exp_year: "",
  date_created: "",
  date_modified: ""
});

export const address: () => Address = () => ({
  address_name: "",
  first_name: "",
  last_name: "",
  company: "",
  phone: "",
  address1: "",
  address2: "",
  city: "",
  region: "",
  postal_code: "",
  country: "",
  is_default_billing: false,
  is_default_shipping: false,
  date_created: "",
  date_modified: ""
});

export const customer: () => FullGetResponse = () => ({
  id: -1,
  email: "",
  last_name: "",
  first_name: "",
  last_login_date: "",
  tax_id: "",
  is_anonymous: true,
  date_created: "",
  date_modified: "",
  _links: {
    "fx:checkout": {
      title: "",
      href: ""
    }
  },
  _embedded: {
    "fx:default_payment_method": method(),
    "fx:default_shipping_address": address(),
    "fx:default_billing_address": address(),
    "fx:subscriptions": [],
    "fx:transactions": [],
    "fx:attributes": []
  }
});
