import { APIError } from "./utils";

export interface PostRequest {
  email: string;
}

export interface PostResponse {
  forgotPassword: boolean;
}

/**
 * Sets a temporary password on customer's account and
 * sends an email to the provided inbox if it exists.
 * Same as `/s/customer/forgot_password`.
 *
 * @param endpoint Full API endpoint, e.g. `https://foxy-demo.foxycart.com/s/customer/forgot_password`.
 * @param request Query parameters.
 */
export async function post(endpoint: string, request: PostRequest) {
  const response = await window.fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request)
  });

  if (response.ok) {
    return response.json() as Promise<PostResponse>;
  } else {
    throw new APIError(await response.json());
  }
}
