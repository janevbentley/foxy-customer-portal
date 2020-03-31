import { FunctionalComponent, h } from "@stencil/core";
import { Subscription } from "../../assets/types/Subscription";
import { Skeleton } from "../Skeleton";

interface Props {
  item: Subscription;
  i18n: null | {
    statusDescription: (item: Subscription) => string;
  };
}

export const StatusSummary: FunctionalComponent<Props> = props => (
  <div class="font-tnum flex items-center pb-s sm:pb-0">
    <div
      class={{
        "text-s mr-s": true,
        "text-success": props.item.is_active,
        "text-contrast-50": !props.item.is_active
      }}
    >
      ●
    </div>
    <Skeleton
      loaded={Boolean(props.i18n)}
      text={() => props.i18n.statusDescription(props.item)}
    />
  </div>
);
