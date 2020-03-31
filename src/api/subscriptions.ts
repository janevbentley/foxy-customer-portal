import JSCookie from "js-cookie";
import { Transaction } from "../assets/types/Transaction";
import { Subscription } from "../assets/types/Subscription";
import { ListResponse as Shared } from "../assets/types/ListResponse";
import { APIError, Embed, Fields, serializeQuery } from "./utils";

export type EditableSubscription = Pick<
  Subscription,
  "next_transaction_date" | "frequency"
>;

export type ListResponse<K extends string, T = any> = Shared & {
  /** Embedded resources. */
  _embedded: Record<K, T>;
};

export type GetRequest = {
  /** Zoomable resources. */
  zoom?: {
    /** If set to `true`, includes subscription's transactions in `_embedded`. */
    transactions?: boolean;
  };

  /** Number of items to skip. Defaults to 0. */
  offset?: number;

  /** Number of items to fetch. Defaults to 10. */
  limit?: number;

  /** Ordering options. By default will order by `next_transaction_date` (asc). */
  order?:
    | keyof Subscription
    | Partial<Record<keyof Fields<Subscription>, "asc" | "desc">>;
};

export type GetResponse<T extends GetRequest> = ListResponse<
  "fx:subscriptions",
  (Subscription & Embed<T, "transactions", "fx:transactions", Transaction[]>)[]
>;

/**
 * Makes a GET request to `/s/customer/subscriptions`, fetching
 * a subset of customer's subscriptions that satisfy given constraints.
 *
 * @param endpoint Full API endpoint URL.
 * @param request Query parameters.
 */
export async function get<T extends GetRequest>(endpoint: string, request: T) {
  const query = serializeQuery(request);

  if (Boolean(request.zoom)) {
    query.set("zoom", Object.keys(request.zoom).toString());
  }

  const response = await window.fetch(`${endpoint}?${query.toString()}`, {
    method: "GET",
    headers: { "fx.customer": JSCookie.get("fx.customer") }
  });

  if (response.ok) {
    return response.json() as Promise<GetResponse<T>>;
  } else {
    throw new APIError(await response.json());
  }
}

export type PatchRequest = Partial<EditableSubscription>;

export type PatchResponse = Subscription;

/**
 * Makes a PATCH request to `/s/customer/subscriptions/:id`, updating
 * the subscription. Auth is required, returns updated subscription.
 *
 * @param endpoint Value of `subscription._links.self.href`.
 * @param request Data to update.
 */
export async function patch(endpoint: string, request: PatchRequest) {
  const response = await window.fetch(endpoint, {
    method: "PATCH",
    body: JSON.stringify(request),
    headers: {
      "Content-Type": "application/json",
      "fx.customer": JSCookie.get("fx.customer")
    }
  });

  if (response.ok) {
    return response.json() as Promise<PatchResponse>;
  } else {
    throw new APIError(await response.json());
  }
}
