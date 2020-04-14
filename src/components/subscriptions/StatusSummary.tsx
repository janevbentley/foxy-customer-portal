import { FunctionalComponent, h } from "@stencil/core";
import { Subscription } from "../../assets/types/Subscription";
import { Skeleton } from "../Skeleton";
import { isCancelled } from "./utils";

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
        "text-success": !isCancelled(props.item),
        "text-contrast-50": isCancelled(props.item)
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
