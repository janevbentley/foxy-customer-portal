import { FunctionalComponent, h } from "@stencil/core";
import { Subscription } from "../../../../assets/types/Subscription";
import { Messages } from "../../types";
import { getUpdateUrl } from "../../utils";

interface Props {
  subscription: Subscription;
  i18n: Messages;
}

export const TransactionsError: FunctionalComponent<Props> = props => (
  <div>
    <p class="whitespace-normal text-s text-body leading-s py-s md:pt-0">
      {props.subscription.error_message}
    </p>

    <a
      href={getUpdateUrl(props.subscription)}
      target="_blank"
      rel="nofollow noreferrer noopener"
      class="inline-block text-white w-full leading-xs text-m my-s py-s px-m bg-error rounded text-center transition duration-150 cursor-pointer hover:opacity-75 focus:outline-none focus:shadow-outline md:w-auto"
    >
      {props.i18n.ccUpdateFailed}
      <iron-icon class="iron-icon-14px ml-xs" icon="open-in-new" />
    </a>
  </div>
);
