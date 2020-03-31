import { FunctionalComponent, h } from "@stencil/core";
import { LinkButton } from "../LinkButton";
import { Subscription } from "../../assets/types/Subscription";

interface Props {
  row: number;
  item: Subscription;
  i18n: null | {
    update: string;
    cancel: string;
  };
}

export const ItemActions: FunctionalComponent<Props> = props => {
  const tokenURL = props.item._links["fx:sub_token_url"].href;

  return (
    <div class="flex flex-wrap justify-between -mx-s sm:flex-no-wrap sm:justify-start">
      <slot name={`row-${props.row}-actions-prepend`} />

      <slot name={`row-${props.row}-actions-update-billing`}>
        <LinkButton
          href={`${tokenURL}&cart=checkout&sub_restart=auto`}
          disabled={!props.item.is_active}
          loaded={Boolean(props.i18n)}
          text={() => props.i18n.update}
          icon="credit-card"
          e2e="lnk-update"
        />
      </slot>

      <slot name={`row-${props.row}-actions-cancel`}>
        <LinkButton
          href={`${tokenURL}&sub_cancel=true`}
          disabled={!props.item.is_active}
          loaded={Boolean(props.i18n)}
          text={() => props.i18n.cancel}
          theme="error"
          icon="close"
          e2e="lnk-cancel"
        />
      </slot>

      <slot name={`row-${props.row}-actions-append`} />
    </div>
  );
};
