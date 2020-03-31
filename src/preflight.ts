import "unfetch/polyfill";
import "details-polyfill";

import "@polymer/iron-icon/iron-icon";
import "@polymer/iron-icons/iron-icons";

import "@vaadin/vaadin-dialog/theme/lumo/vaadin-dialog";
import "@vaadin/vaadin-select/theme/lumo/vaadin-select";
import "@vaadin/vaadin-notification/theme/lumo/vaadin-notification";
import "@vaadin/vaadin-combo-box/theme/lumo/vaadin-combo-box";
import "@vaadin/vaadin-text-field/theme/lumo/vaadin-password-field";
import "@vaadin/vaadin-text-field/theme/lumo/vaadin-email-field";
import "@vaadin/vaadin-text-field/theme/lumo/vaadin-text-field";
import "@vaadin/vaadin-progress-bar/theme/lumo/vaadin-progress-bar";
import "@vaadin/vaadin-date-picker/theme/lumo/vaadin-date-picker";
import "@vaadin/vaadin-button/theme/lumo/vaadin-button";
import "@vaadin/vaadin-tabs/theme/lumo/vaadin-tabs";

import { style as subscriptionsStyle } from "./components/subscriptions/style";

/**
 * This is a globalScript: @see https://stenciljs.com/docs/config#globalscript
 *
 * We load all Vaadin components here in bulk to avoid duplicate
 * custom element registration attempts both in development (hot reload) and
 * production environments. This also allows us to keep track of all 3rd-party
 * components in one place.
 */
export default () => {
  document.body.appendChild(document.createElement("foxy-plugin-warning"));
  document.head.insertAdjacentHTML("beforeend", subscriptionsStyle);
};
