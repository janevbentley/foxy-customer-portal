import { Subscription } from "../../assets/types/Subscription";

export function formatDate(date: Date) {
  return [
    String(date.getFullYear()).padStart(4, "0"),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")
  ].join("-");
}

export function getCancelUrl(subscription: Subscription) {
  const subTokenUrl = subscription._links["fx:sub_token_url"].href;
  const subTokenUrlInstance = new URL(subTokenUrl);

  subTokenUrlInstance.searchParams.set("sub_cancel", "true");

  return subTokenUrlInstance.toString();
}

export function getUpdateUrl(subscription: Subscription) {
  const subTokenUrl = subscription._links["fx:sub_token_url"].href;
  const subTokenUrlInstance = new URL(subTokenUrl);

  subTokenUrlInstance.searchParams.set("cart", "checkout");
  subTokenUrlInstance.searchParams.set("sub_restart", "auto");

  return subTokenUrlInstance.toString();
}
