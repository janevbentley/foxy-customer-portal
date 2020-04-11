import "@webcomponents/webcomponentsjs";
import "unfetch/polyfill";

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
import { isIE11 } from "./assets/utils/isIE11";

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

  if (!isIE11()) {
    /**
     * Polymer's <dom-module> that Vaadin uses for custom styling
     * causes affected elements to disappear in IE11 in our setup. Unfortunately, we
     * couldn't find neither the cause of this issue nor the appropriate solution and
     * therefore have decided to not apply the minor visual enhancements below in this browser.
     */
    document.head.insertAdjacentHTML("beforeend", subscriptionsStyle);
  }
};
