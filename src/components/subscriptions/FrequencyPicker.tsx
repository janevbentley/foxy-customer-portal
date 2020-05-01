import { FunctionalComponent, h } from "@stencil/core";
import { Skeleton } from "../Skeleton";
import { Subscription } from "../../assets/types/Subscription";
import { isCancelled } from "./utils";

interface Props {
  item: Subscription;
  i18n: {
    frequencyDescription: (v: string) => string;
    frequency: string;
  } | null;
  onChange: (e: Event) => any;
}

function renderItems({ item, i18n }: Props, root: HTMLElement) {
  if (root.firstElementChild !== null) return;

  const config = item._embedded.template_config;
  const allowedValues = config.allow_frequency_modification;
  const renderedValues = Array.isArray(allowedValues) ? [...allowedValues] : [];

  if (!renderedValues.includes(item.frequency)) {
    renderedValues.unshift(item.frequency);
  }

  const items = renderedValues.reduce((result, value) => {
    const text = i18n.frequencyDescription(value);
    const html = `<vaadin-item value="${value}">${text}</vaadin-item>`;
    return result + html;
  }, "");

  root.innerHTML = `<vaadin-list-box>${items}</vaadin-list-box>`;
}

export const FrequencyPicker: FunctionalComponent<Props> = props => {
  const config = props.item._embedded.template_config;
  const values = config.allow_frequency_modification;
  const readonly =
    !values || !values.length || !props.i18n || isCancelled(props.item);

  return (
    <div class={{ "pb-s sm:pb-0": !readonly }}>
      <div class="text-s text-contrast-50 sm:hidden">
        <Skeleton
          loaded={Boolean(props.i18n)}
          text={() => props.i18n.frequency}
        />
      </div>
      <vaadin-select
        class="w-full"
        data-e2e="fld-freq"
        data-theme="foxy-subscriptions"
        readonly={readonly}
        value={props.item.frequency}
        renderer={root => renderItems(props, root)}
        onChange={event => props.onChange(event)}
      />
    </div>
  );
};
