import { FunctionalComponent, h } from "@stencil/core";
import { ConfirmDialog } from "../../ConfirmDialog";
import { Notification } from "../../Notification";
import { formatDate } from "../utils";
import { Messages } from "../types";

interface Props {
  disabled: boolean;
  newValue: string;
  value: string | Date;
  i18n: Messages;
  errorRef: (el: VaadinNotification) => any;
  successRef: (el: VaadinNotification) => any;
  confirmRef: (el: VaadinDialog) => any;
  onChangeRequest: (newValue: string) => any;
  onChange: (newValue: string) => any;
}

export const NextDatePicker: FunctionalComponent<Props> = (props: Props) => (
  <div>
    <vaadin-date-picker
      data-e2e="fld-date"
      class="w-full"
      label={props.i18n.selectNextDate}
      min={props.disabled ? undefined : formatDate(new Date())}
      i18n={props.i18n.pickerI18n}
      value={formatDate(new Date(props.value))}
      disabled={props.disabled}
      onChange={(event: Event) => {
        const picker = event.target as HTMLInputElement;
        const oldDate = formatDate(new Date(props.value));

        if (picker.value !== oldDate) {
          const [y, m, d] = picker.value.split("-").map(v => parseInt(v));
          const newDate = new Date(y, m - 1, d);

          props.onChangeRequest(newDate.toISOString());
          setTimeout(() => (picker.value = oldDate));
        }
      }}
    />

    <ConfirmDialog
      i18n={props.i18n}
      ref={props.confirmRef}
      text={props.i18n.nextDateConfirm(props.newValue)}
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
