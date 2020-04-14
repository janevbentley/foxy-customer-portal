import { Subscription } from "../../assets/types/Subscription";

export function isCancelled(subscription: Subscription) {
  if (!subscription.end_date) return false;

  const endsWithNextPayment = subscription.end_date === subscription.next_transaction_date;
  const endsWithinADay = new Date(subscription.end_date).getTime() - Date.now() <= 86400000;

  return !subscription.is_active || endsWithinADay || endsWithNextPayment;
}
