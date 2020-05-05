import { FunctionalComponent, h } from "@stencil/core";
import { Subscription } from "../../../../assets/types/Subscription";
import { Transaction } from "../../../../assets/types/Transaction";
import { Messages } from "../../types";
import { Link } from "../../../Link";
import { TransactionsError } from "./TransactionsError";

interface Props {
  onObserverTarget: (v: HTMLElement) => any;
  subscription: Subscription;
  transaction: Pick<
    Transaction,
    "transaction_date" | "display_id" | "currency_code" | "total_order"
  > & { _links?: Transaction["_links"] };
  i18n: Messages;
}

export const TransactionsRow: FunctionalComponent<Props> = props => {
  const failed =
    props.transaction.transaction_date ===
    props.subscription.first_failed_transaction_date;

  const active = !Boolean(props.subscription.end_date);
  const status = failed ? "failed" : active ? "active" : "cancelled";

  return (
    <tr
      class="w-240px snap-start relative border border-contrast-10 rounded-m px-s py-xs inline-flex align-top flex-wrap m-xs md:w-auto md:snap-none md:table-row md:border-none md:p-0"
      data-e2e="transaction"
    >
      <td class="sr-only p-0 md:w-72px md:not-sr-only md:text-center">
        <div class="sr-only">{props.i18n[status]}</div>
        <div
          class={{
            "mx-m my-s p-xs rounded-full items-center justify-center mx-s md:inline-flex": true,
            "bg-success-10 text-success": status === "active",
            "bg-contrast-5 text-body": status === "cancelled",
            "bg-error-10 text-error": status === "failed"
          }}
        >
          <iron-icon
            icon={failed ? "error-outline" : "done"}
            class="iron-icon-16px"
          />
        </div>
      </td>

      <td class="text-left order-1 text-body leading-xs text-xxl font-tnum font-medium w-1/2 p-0 block md:table-cell md:text-m md:w-auto md:align-middle">
        {props.i18n.price(
          props.transaction.total_order,
          props.transaction.currency_code
        )}
      </td>

      <td
        class={`p-0 text-left order-2 leading-xs block md:table-cell md:align-middle ${
          failed ? "w-full md:w-auto" : ""
        }`}
      >
        <time
          dateTime={new Date().toISOString()}
          class={`leading-xs ${failed ? "text-error" : "text-body"}`}
        >
          {props.i18n.date(props.transaction.transaction_date)}
        </time>

        {!failed && (
          <span role="presentation" class="leading-xs text-success md:hidden">
            &nbsp;•&nbsp;
          </span>
        )}
      </td>

      <td class="p-0 order-3 font-tnum leading-xs text-tertiary block md:table-cell md:text-center md:align-middle">
        {!failed && `#${props.transaction.display_id}`}
      </td>

      <td
        class={`${
          failed
            ? "order-last w-full"
            : "order-1 w-1/2 text-right md:table-cell md:align-middle"
        } block p-0 md:w-auto`}
      >
        {failed ? (
          <div ref={v => failed && props.onObserverTarget(v)} class="md:hidden">
            <TransactionsError {...props} />
          </div>
        ) : (
          <Link
            href={props.transaction._links?.["fx:receipt"].href}
            text={props.i18n.receipt}
          />
        )}
      </td>
    </tr>
  );
};
