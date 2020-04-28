import { FunctionalComponent, h } from "@stencil/core";
import { Skeleton } from "../../Skeleton";
import { Messages } from "../types";
import { Subscription } from "../../../assets/types/Subscription";

interface Props {
  i18n: Messages;
  subscription: Subscription;
}

export const BillingDetails: FunctionalComponent<Props> = ({
  i18n,
  subscription
}) => (
  <div class="md:p-m md:border md:border-contrast-30 md:border-dashed md:rounded">
    <p class="text-body font-medium flex-1 md:text-center">
      <div class="inline-block leading-xs text-xl md:text-xxl">
        <Skeleton
          loaded={Boolean(subscription)}
          text={() => {
            const template = subscription._embedded["fx:transaction_template"];
            const { total_order, currency_code } = template;
            return i18n.price(total_order, currency_code);
          }}
        />
      </div>

      <div class="inline-block leading-xs text-l md:text-xl">
        <Skeleton
          loaded={Boolean(subscription)}
          text={() => {
            const { frequency } = subscription;
            return `/${i18n.frequencyDescription(frequency)}`;
          }}
        />
      </div>
    </p>

    <p class="leading-xs text-s text-tertiary flex-1 md:text-center md:text-l">
      <Skeleton
        loaded={Boolean(subscription)}
        text={() => i18n.statusDescription(subscription)}
      />
    </p>
  </div>
);
