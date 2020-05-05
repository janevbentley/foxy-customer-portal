import { FunctionalComponent, h } from "@stencil/core";
import { TransactionTemplate } from "../../../assets/types/TransactionTemplate";
import { Messages } from "../types";
import { Link } from "../../Link";

interface Props {
  template: TransactionTemplate;
  item: TransactionTemplate["_embedded"]["fx:items"][number];
  i18n: Messages;
}

export const CartItem: FunctionalComponent<Props> = props => (
  <figure class="flex items-center px-s" data-e2e="product">
    <div class="relative h-l w-l m-s rounded-m bg-contrast-10 overflow-hidden">
      {props.item.image && (
        <img
          src={props.item.image}
          alt={props.i18n.productImageAlt}
          class="absolute inset-0 w-full h-full"
          loading="lazy"
        />
      )}
    </div>

    <figcaption class="m-s">
      <Link
        href={props.item.url}
        text={props.item.name}
        title={props.i18n.productLinkTitle}
      />

      <div class="text-tertiary leading-s text-s">
        {props.i18n.productDescription(
          props.item.price,
          props.template.currency_code,
          props.item.quantity
        )}
      </div>
    </figcaption>
  </figure>
);
