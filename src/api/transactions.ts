import JSCookie from "js-cookie";
import { Transaction } from "../assets/types/Transaction";
import { ListResponse as Shared } from "../assets/types/ListResponse";
import { APIError, Fields, serializeQuery } from "./utils";

export type ListResponse<K extends string, T = any> = Shared & {
  /** Embedded resources. */
  _embedded: Record<K, T>;
};

export type GetRequest = {
  /** Number of items to skip. Defaults to 0. */
  offset?: number;

  /** Number of items to fetch. Defaults to 10. */
  limit?: number;

  /** Ordering options. By default will order by `transaction_date` (desc). */
  order?:
    | keyof Transaction
    | Partial<Record<keyof Fields<Transaction>, "asc" | "desc">>;
};

export type GetResponse = ListResponse<"fx:transactions", Transaction[]>;

/**
 * Makes a GET request to `/s/customer/transactions`, fetching
 * a subset of customer's transactions that satisfy given constraints.
 *
 * @param endpoint Full API endpoint URL.
 * @param request Query parameters.
 */
export async function get(endpoint: string, request: GetRequest) {
  const query = serializeQuery(request);

  const response = await window.fetch(`${endpoint}?${query.toString()}`, {
    method: "GET",
    headers: { "fx.customer": JSCookie.get("fx.customer") }
  });

  if (response.ok) {
    return response.json() as Promise<GetResponse>;
  } else {
    throw new APIError(await response.json());
  }
}
