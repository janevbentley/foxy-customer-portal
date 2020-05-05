import { FunctionalComponent, h } from "@stencil/core";
import { ConfirmDialog } from "../../ConfirmDialog";
import { Notification } from "../../Notification";
import { Messages } from "../types";

interface Props {
  disabled?: boolean;
  newValue?: string;
  options?: string[];
  value?: string;
  i18n?: Messages;
  errorRef?: (el: VaadinNotification) => any;
  successRef?: (el: VaadinNotification) => any;
  confirmRef?: (el: VaadinDialog) => any;
  onChangeRequest?: (newValue: string) => any;
  onChange?: (newValue: string) => any;
}

export const FrequencyPicker: FunctionalComponent<Props> = (props: Props) => (
  <div>
    <vaadin-select
      data-e2e="fld-freq"
      class="w-full"
      label={props.i18n.selectFrequency}
      value={props.value}
      disabled={props.disabled}
      renderer={(root: HTMLElement) => {
        if (root.firstElementChild !== null) return;

        const allowedValues = props.options;
        const renderedValues = Array.isArray(allowedValues)
          ? [...allowedValues]
          : [];

        if (!renderedValues.includes(props.value)) {
          renderedValues.unshift(props.value);
        }

        const items = renderedValues.reduce((result, value) => {
          const text = props.i18n.frequencyDescription(value);
          const html = `<vaadin-item value="${value}">${text}</vaadin-item>`;
          return result + html;
        }, "");

        root.innerHTML = `<vaadin-list-box>${items}</vaadin-list-box>`;
      }}
      onChange={(event: Event) => {
        const select = event.target as HTMLInputElement;

        if (select.value !== props.value) {
          props.onChangeRequest(select.value);
          setTimeout(() => (select.value = props.value));
        }
      }}
    />

    <ConfirmDialog
      i18n={props.i18n}
      ref={props.confirmRef}
      text={props.i18n.frequencyConfirm(props.newValue ?? "")}
      onOK={() => props.onChange(props.newValue)}
    />

    <Notification
      theme="success"
      i18n={props.i18n}
      ref={props.successRef}
      text={props.i18n.updateNotification}
    />

    <Notification
      theme="error"
      i18n={props.i18n}
      ref={props.errorRef}
      text={props.i18n.errorNotification}
    />
  </div>
);
