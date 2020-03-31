import JSCookie from "js-cookie";
import { APIError } from "./utils";

let cookieExpiryDate = null as null | Date;

/** Returns auth cookie expiry date as long as the browser tab is open after sign in.  */
export const getCookieExpiryDate = () => cookieExpiryDate;

export type PostRequest = {
  /** Customer's email. */
  email: string;

  /**
   * Customer's current password or one-time code
   * generated with the help of the password reset feature.
   */
  password: string;
};

export type PostResponse = {
  /** The session lifetime as configured in Foxy (in seconds). */
  cookieMaxAge: number;

  /** Name of the auth cookie and the respective auth header. */
  cookieName: string;

  /** Value of the auth cookie and the respective auth header. */
  cookieValue: string;

  /** Optional JWT string using RS256 (public/private key) signing. */
  jwt?: string;
};

/**
 * Sends POST request to `/s/customer/authenticate`.
 *
 * @param endpoint Full API endpoint, e.g. `https://foxy-demo.foxycart.com/s/customer/authenticate`.
 * @param request Auth params.
 */
export async function post(endpoint: string, request: PostRequest) {
  const response = await window.fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request)
  });

  if (response.ok) {
    const json = (await response.json()) as PostResponse;

    cookieExpiryDate = new Date(Date.now() + json.cookieMaxAge * 1000);
    const options = {
      expires: cookieExpiryDate,
      secure: location.hostname !== "localhost"
    };

    JSCookie.set(json.cookieName, json.cookieValue, options);
    JSCookie.set(`${json.cookieName}.jwt`, json.jwt, options);

    return json;
  } else {
    throw new APIError(await response.json());
  }
}

/**
 * Removes all cookies that start with `fx.customer`,
 * including the auth cookie.
 */
export function reset() {
  cookieExpiryDate = null;

  Object.keys(JSCookie.get())
    .filter(name => name.startsWith("fx.customer"))
    .forEach(name => JSCookie.remove(name));
}

/**
 * Checks if auth cookie is set.
 */
export function check() {
  return Boolean(JSCookie.get("fx.customer"));
}
