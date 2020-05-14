import { FunctionalComponent, h } from "@stencil/core";

interface Props {
  ref: (el: VaadinDialog) => any;
  i18n: Record<"ok" | "cancel", string> | null;
  text: string;
  onOK: () => any;
}

export const ConfirmDialog: FunctionalComponent<Props> = props => (
  <vaadin-dialog
    no-close-on-esc
    no-close-on-outside-click
    ref={props.ref}
    renderer={(root: HTMLElement, dialog: VaadinDialog) => {
      let div: HTMLDivElement;

      if (root.firstElementChild === null) {
        div = document.createElement("div");
        const okButton = document.createElement("vaadin-button");
        const cancelButton = document.createElement("vaadin-button");

        div.setAttribute("style", "margin-bottom: 1em");

        okButton.textContent = props.i18n.ok;
        okButton.setAttribute("theme", "primary");
        okButton.setAttribute("data-e2e", "btn-ok");
        okButton.setAttribute("style", "margin-right: 1em");
        okButton.addEventListener("click", () => {
          dialog.opened = false;
          props.onOK();
        });

        cancelButton.textContent = props.i18n.cancel;
        cancelButton.addEventListener("click", () => {
          dialog.opened = false;
        });

        root.appendChild(div);
        root.appendChild(okButton);
        root.appendChild(cancelButton);
      } else {
        div = root.querySelector("div");
      }

      div.textContent = props.text;
    }}
  />
);
