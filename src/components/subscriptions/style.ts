/**
 * Vaadin styling overrides to be injected into <head>
 * in /src/preflight.ts (manual import required).
 */
export const style = `
  <dom-module id="fx-css-0" theme-for="vaadin-date-picker vaadin-text-field vaadin-select">
    <template>
      <style>
        :host([theme~="foxy-subscriptions"][readonly]) [part="input-field"] {
          color: var(--foxy-body-text-color);
        }

        :host([theme~="foxy-subscriptions"][readonly]) vaadin-select-text-field,
        :host([theme~="foxy-subscriptions"][readonly]) [part="text-field"],
        :host([theme~="foxy-subscriptions"][readonly]) [part="input-field"],
        :host([theme~="foxy-subscriptions"][readonly]) [part="value"] {
          padding: 0;
          margin: 0;
        }

        :host([theme~="foxy-subscriptions"][readonly]) [part="input-field"]::before,
        :host([theme~="foxy-subscriptions"][readonly]) [part="input-field"]::after,
        :host([theme~="foxy-subscriptions"][readonly]) [part="toggle-button"] {
          display: none;
        }
      </style>
    </template>
  </dom-module>
`;
