import { FunctionalComponent, h } from "@stencil/core";
import { Transaction } from "../../../../assets/types/Transaction";
import { Messages } from "../../types";

interface Props {
  transaction: Pick<Transaction, "transaction_date">;
  i18n: Messages;
}

export const TransactionsSubheader: FunctionalComponent<Props> = props => (
  <tr class="table-subheader snap-start inline-block sticky left-0 bg-base md:table-row">
    <th
      class="inline-block p-0 text-xs text-tertiary text-left font-normal font-tnum md:table-cell md:pl-72px md:pt-s"
      scope="colgroup"
      colSpan={5}
    >
      {props.i18n.year(props.transaction.transaction_date)}
    </th>
  </tr>
);
