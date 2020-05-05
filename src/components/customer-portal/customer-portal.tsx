import {
  Component,
  Element,
  State,
  Prop,
  h,
  Watch,
  Listen,
  Event,
  EventEmitter,
  Method
} from "@stencil/core";

import * as vaadin from "../../mixins/vaadin";
import * as store from "../../mixins/store";
import * as i18n from "../../mixins/i18n";
import { i18nProvider } from "./i18n";

import {
  reset as resetAuthCookie,
  check as isSignedIn
} from "../../api/authenticate";

import { FullGetResponse, get as getCustomer } from "../../api";
import { Details } from "../Details";
import { Messages } from "./types";
import { Skeleton } from "../Skeleton";

const paths = ["activity", "account"] as const;

@Component({
  tag: "foxy-customer-portal",
  styleUrl: "../../tailwind.css",
  shadow: true
})
export class CustomerPortal
  implements vaadin.Mixin, store.Mixin, i18n.Mixin<typeof i18nProvider> {
  private defaultPathAlias: string | null = null;

  @State() state = store.defaults.state.call(this);
  @State() i18n: Messages | null = null;
  @State() i18nProvider = i18nProvider;

  @State() areTransactionsOpen = true;
  @State() areSubscriptionsOpen = true;
  @State() areDownloadsOpen = false;
  @State() isSignedIn = isSignedIn();
  @State() tabIndex = 0;

  /** Foxy Customer Portal API endpoint. */
  @Prop() endpoint = "";

  /** The language to display element content in. */
  @Prop() locale = i18n.defaults.locale.call(this);

  /** Enables hash-based routing. */
  @Prop() router = false;

  /** Prefix for routes and other top-level identifiers. */
  @Prop() scope = "foxy-customer-portal";

  @Watch("locale")
  onLocaleChange(newValue: string) {
    i18n.onLocaleChange.call(this, newValue);
  }

  @Element() readonly root: HTMLFoxyCustomerPortalElement;

  /** Fired after the user signs in. */
  @Event({
    eventName: "signin",
    composed: true,
    bubbles: true
  })
  readonly signin: EventEmitter<void>;

  /** Fired after each update of the customer object (the state). */
  @Event({
    eventName: "update",
    composed: true,
    bubbles: true
  })
  readonly update: EventEmitter<FullGetResponse>;

  /** Fired after the user signs out. */
  @Event({
    eventName: "signout",
    composed: true,
    bubbles: true
  })
  readonly signout: EventEmitter<void>;

  /** Fired when component becomes ready to be interacted with. */
  @Event({
    eventName: "ready",
    composed: true,
    bubbles: true
  })
  readonly ready: EventEmitter<void>;

  componentWillLoad() {
    this.initRouter();
    this.handleHashChange();
    i18n.componentWillLoad.call(this);
  }

  async componentDidLoad() {
    await store.componentDidLoad.call(this);
    this.ready.emit();
  }

  componentDidRender() {
    vaadin.componentDidRender.call(this);
  }

  @Listen("update")
  handleUpdate(e: CustomEvent<store.Mixin["update"]>) {
    store.setState.call(this, e.detail);
  }

  @Listen("signin")
  async handleSignIn() {
    this.isSignedIn = true;
    await this.getState(true);
  }

  @Listen("signout")
  async handleSignOut() {
    this.isSignedIn = false;
    await this.setState(store.defaults.state.call(this));
  }

  @Listen("hashchange", { target: "window" })
  handleHashChange() {
    if (this.router) {
      if (location.hash === this.defaultPathAlias) {
        this.tabIndex = 0;
      } else {
        const path = this.parseHash(location.hash);
        const index = paths.findIndex(hash => hash === path);
        if (index !== -1) this.tabIndex = index;
      }
    }
  }

  /** Resolves with a customer object (the state). */
  @Method()
  async getRemoteState() {
    let customer: FullGetResponse | null = null;

    try {
      customer = await getCustomer(`${this.endpoint}/s/customer`, {
        sso: true,
        zoom: {
          default_billing_address: true,
          default_shipping_address: true,
          default_payment_method: true,
          subscriptions: true,
          transactions: true
        }
      });
    } catch (e) { }

    return customer;
  }

  /** Resolves with a customer object (the state). */
  @Method()
  async getState(forceReload = false) {
    return store.getState.call(this, forceReload);
  }

  /** Updates the customer object, or the state. */
  @Method()
  async setState(value: Partial<FullGetResponse>) {
    store.setState.call(this, value);
  }

  private initRouter() {
    if (this.router) {
      const path = this.parseHash(location.hash);

      if (paths.findIndex(v => v === path) === -1) {
        this.defaultPathAlias = location.hash;
      }
    }
  }

  private createHash(path: string) {
    return this.scope === "" ? `#${path}` : `#${this.scope}--${path}`;
  }

  private parseHash(hash: string) {
    if (hash[0] === "#") hash = hash.replace("#", "");

    const scope = `${this.scope}--`;
    if (hash.substr(0, scope.length) === scope) hash = hash.replace(scope, "");

    return hash;
  }

  private goTo(path: typeof paths[number]) {
    if (this.router) {
      location.hash = this.createHash(path);
    } else {
      this.tabIndex = paths.indexOf(path);
    }
  }

  private async signOut() {
    resetAuthCookie();
    this.isSignedIn = false;

    await this.setState(store.defaults.state.call(this));

    this.update.emit(this.state);
    this.signout.emit();
  }

  render() {
    return (
      <article class="font-lumo">
        <header
          hidden={!this.isSignedIn}
          class="pt-xl pb-s flex flex-wrap sm:py-l sm:flex-no-wrap"
        >
          <h1 class="truncate text-header text-xxl px-m text-center flex-1 sm:text-left">
            <Skeleton
              loaded={this.i18n && this.state.id !== -1}
              text={() => this.i18n.greeting(this.state.first_name)}
            />
          </h1>

          <nav role="navigation" class="w-full sm:w-auto">
            <vaadin-tabs selected={this.tabIndex} data-theme="minimal centered">
              {paths.map(path => (
                <vaadin-tab
                  data-e2e={`lnk-${path}`}
                  onClick={() => this.goTo(path)}
                >
                  <Skeleton
                    loaded={Boolean(this.i18n)}
                    text={() => this.i18n[path]}
                  />
                </vaadin-tab>
              ))}

              <vaadin-tab
                data-e2e="btn-sign-out"
                onClick={() => this.signOut()}
              >
                <Skeleton
                  loaded={Boolean(this.i18n)}
                  text={() => this.i18n.logout}
                />
              </vaadin-tab>
            </vaadin-tabs>
          </nav>
        </header>

        <slot />

        <section hidden={this.isSignedIn}>
          <slot name="sign-in">
            <foxy-sign-in locale={this.locale} endpoint={this.endpoint} />
          </slot>
        </section>

        <section hidden={!this.isSignedIn || this.tabIndex !== 0}>
          <div class="mb-s sm:mb-m">
            <slot name="subscriptions-container">
              <Details
                open={this.areSubscriptionsOpen}
                summary={() => this.i18n.subscriptions}
                loaded={this.i18n && this.state.id !== -1}
                onToggle={v => (this.areSubscriptionsOpen = v)}
              >
                <slot name="subscriptions">
                  <foxy-subscriptions
                    locale={this.locale}
                    endpoint={this.endpoint}
                  />
                </slot>
              </Details>
            </slot>
          </div>

          <div class="mb-s sm:mb-m">
            <slot name="transactions-container">
              <Details
                open={this.areTransactionsOpen}
                summary={() => this.i18n.transactions}
                loaded={this.i18n && this.state.id !== -1}
                onToggle={v => (this.areTransactionsOpen = v)}
              >
                <slot name="transactions">
                  <foxy-transactions
                    locale={this.locale}
                    endpoint={this.endpoint}
                  />
                </slot>
              </Details>
            </slot>
          </div>

          <div class="mb-s sm:mb-m">
            <slot name="downloadables-container">
              {/* <Details
              open={this.areDownloadsOpen}
              summary={() => this.i18n.downloads}
              loaded={this.i18n && this.state.id !== -1}
              onToggle={v => (this.areDownloadsOpen = v)}
            >
              <slot name="downloadables">
                <div class="p-m text-body">
                  <Skeleton
                    loaded={Boolean(this.i18n)}
                    text={() => this.i18n.comingSoon}
                  />
                </div>
              </slot>
            </Details> */}
            </slot>
          </div>
        </section>

        <section
          hidden={!this.isSignedIn || this.tabIndex !== 1}
          class="flex flex-wrap sm:-m-s"
        >
          <div class="w-full pb-s sm:w-1/2 sm:p-s">
            <div class="bg-base sm:rounded-m sm:shadow-xs">
              <slot name="billing-address">
                <foxy-address
                  type="default_billing_address"
                  endpoint={this.endpoint}
                  locale={this.locale}
                />
              </slot>
            </div>
          </div>

          <div class="w-full pb-s sm:w-1/2 sm:p-s">
            <div class="bg-base sm:rounded-m sm:shadow-xs">
              <slot name="shipping-address">
                <foxy-address
                  type="default_shipping_address"
                  endpoint={this.endpoint}
                  locale={this.locale}
                />
              </slot>
            </div>
          </div>

          <div class="w-full sm:w-1/2 sm:p-s">
            <div class="bg-base sm:rounded-m sm:shadow-xs">
              <slot name="profile">
                <foxy-profile endpoint={this.endpoint} locale={this.locale} />
              </slot>
            </div>
          </div>
        </section>
      </article>
    );
  }
}
