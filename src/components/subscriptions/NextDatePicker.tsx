import { FunctionalComponent, h } from "@stencil/core";
import { Subscription } from "../../assets/types/Subscription";
import { Skeleton } from "../Skeleton";
import { isCancelled } from "./utils";

interface Props {
  onChange: (item: Subscription, event: Event) => any;
  item: Subscription;
  i18n: null | {
    pickerI18n: VaadinDatePickerI18n;
    picker: string;
  };
}

export function formatDate(date: Date) {
  return [
    String(date.getFullYear()).padStart(4, "0"),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")
  ].join("-");
}

export const NextDatePicker: FunctionalComponent<Props> = props => {
  const cancelled = isCancelled(props.item);
  const disabled = !props.item._embedded.template_config.allow_next_date_modification;
  const readonly = disabled || cancelled;

  return (
    <div class={{ "pb-s sm:pb-0": !readonly }}>
      <div class="text-s text-contrast-50 sm:hidden">
        <Skeleton loaded={Boolean(props.i18n)} text={() => props.i18n.picker} />
      </div>
      <vaadin-date-picker
        data-e2e="fld-date"
        data-theme="foxy-subscriptions"
        readonly={readonly}
        class="w-full sm:w-auto sm:mr-s"
        min={readonly ? undefined : formatDate(new Date())}
        i18n={Boolean(props.i18n) ? props.i18n.pickerI18n : undefined}
        value={formatDate(new Date(props.item.next_transaction_date))}
        onChange={(e: Event) => props.onChange(props.item, e)}
      />
    </div>
  );
};
