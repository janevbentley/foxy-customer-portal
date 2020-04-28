import { FunctionalComponent, h } from "@stencil/core";
import { TransactionTemplate } from "../../../../assets/types/TransactionTemplate";
import { Subscription } from "../../../../assets/types/Subscription";
import { Transaction } from "../../../../assets/types/Transaction";
import { Messages } from "../../types";
import { TransactionsError } from "./TransactionsError";
import { TransactionsRow } from "./TransactionsRow";
import { TransactionsSubheader } from "./TransactionsSubheader";

interface Props {
  onObserverTarget: (target: HTMLElement) => any;
  onObserverRoot: (root: HTMLElement) => any;
  subscription: Subscription;
  template: TransactionTemplate;
  items: Transaction[];
  i18n: Messages;
}

function isSubheaderNeeded(
  previous: string | undefined | null,
  current: string
): boolean {
  if (!Boolean(previous)) return true;
  return new Date(previous).getFullYear() !== new Date(current).getFullYear();
}

export const Transactions: FunctionalComponent<Props> = props => {
  const firstFailedDate = props.subscription.first_failed_transaction_date;

  return (
    <table class="block w-full relative md:table">
      <caption class="sr-only">{props.i18n.transactions}</caption>

      <thead class="sr-only">
        <tr>
          <th scope="col">{props.i18n.status}</th>
          <th scope="col">{props.i18n.amount}</th>
          <th scope="col">{props.i18n.timestamp}</th>
          <th scope="col">{props.i18n.id}</th>
          <th scope="col">{props.i18n.links}</th>
        </tr>
      </thead>

      <tbody
        class="snap-x-mandatory scroll-px-20 block whitespace-no-wrap p-m pt-xl -mx-xs -mt-s overflow-x-auto overflow-y-hidden md:p-0 md:table-row-group md:whitespace-normal md:overflow-auto md:snap-none md:scroll-px-0"
        ref={props.onObserverRoot}
      >
        {firstFailedDate && [
          <TransactionsSubheader
            i18n={props.i18n}
            transaction={{
              transaction_date: firstFailedDate
            }}
          />,

          <TransactionsRow
            {...props}
            transaction={{
              display_id: 0,
              transaction_date: firstFailedDate,
              currency_code: props.template.currency_code,
              total_order: props.template.total_order
            }}
          />,

          <tr class="hidden md:table-row">
            <th class="sr-only">{props.i18n.error}</th>
            <td colSpan={4} class="pb-s">
              <TransactionsError {...props} />
            </td>
          </tr>
        ]}

        {props.items.map((transaction, index, items) => [
          isSubheaderNeeded(
            items[index - 1]?.transaction_date ?? firstFailedDate,
            transaction.transaction_date
          ) && (
            <TransactionsSubheader
              transaction={transaction}
              i18n={props.i18n}
            />
          ),
          <TransactionsRow {...props} transaction={transaction} />
        ])}

        <tr class="inline-block align-top snap-end md:snap-none md:table-row">
          <th
            id="foxy-actions-header"
            scope="colgroup"
            headers="blank"
            class="sr-only"
          >
            {props.i18n.links}
          </th>

          <td class="p-0" colSpan={5} headers="foxy-actions-header">
            <vaadin-button
              class="mx-xs w-full md:mx-0 md:my-m"
              data-theme="contrast"
              disabled
            >
              {props.i18n.loadMore}
            </vaadin-button>
          </td>
        </tr>
      </tbody>
    </table>
  );
};
