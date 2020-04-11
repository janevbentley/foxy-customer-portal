import {
  Component,
  Element,
  Prop,
  State,
  Method,
  Event,
  Watch,
  h,
  EventEmitter
} from "@stencil/core";

import {
  FullGetResponse,
  GetRequest,
  GetResponse,
  get as getCustomer
} from "../../api";

import {
  get as getSubscriptions,
  patch as updateSubscription
} from "../../api/subscriptions";

import * as vaadin from "../../mixins/vaadin";
import * as store from "../../mixins/store";
import * as i18n from "../../mixins/i18n";
import { i18nProvider } from "./i18n";

import { getParentPortal } from "../../assets/utils/getParentPortal";
import { Subscription } from "../../assets/types/Subscription";
import { SubscriptionDataTable } from "../DataTable";
import { Messages } from "./types";
import { ErrorOverlay } from "../ErrorOverlay";
import { APIError } from "../../api/utils";
import { FrequencyPicker } from "./FrequencyPicker";
import { ToastPopup } from "./ToastPopup";
import { ConfirmDialog } from "./ConfirmDialog";
import { NextDatePicker, formatDate } from "./NextDatePicker";
import { StatusSummary } from "./StatusSummary";
import { ItemActions } from "./ItemActions";

@Component({
  tag: "foxy-subscriptions",
  styleUrl: "../../tailwind.css",
  shadow: true
})
export class Subscriptions
  implements vaadin.Mixin, store.Mixin, i18n.Mixin<typeof i18nProvider> {
  private readonly limit = 4;
  private confirm: VaadinDialog;
  private toast: VaadinNotification;

  @State() state = store.defaults.state.call(this) as FullGetResponse;
  @State() i18nProvider = i18nProvider;
  @State() i18n: Messages | null = null;

  @State() error = "";
  @State() isErrorDismissable = false;

  @State() start = 0;
  @State() hasMore = true;
  @State() isLoadingNext = false;

  @State() activeItem: Subscription | null = null;

  @State() confirmText = "";
  @State() toastTheme = "error" as "success" | "error";
  @State() toastText = "";

  @Element() readonly root: HTMLFoxySubscriptionsElement;

  /** Foxy Customer Portal API endpoint. */
  @Prop() endpoint = "";

  /** The language to display element content in. */
  @Prop() locale = i18n.defaults.locale.call(this);

  @Watch("locale")
  onLocaleChange(newValue: string) {
    i18n.onLocaleChange.call(this, newValue);
  }

  /** The number of columns in the table (affects the number of slots). */
  @Prop() cols = 4;

  /**
   * Emitted after the component makes changes to the
   * state, containing the changed data in its payload.
   */
  @Event({
    eventName: "update",
    composed: true,
    bubbles: true
  })
  readonly update: EventEmitter<FullGetResponse>;

  /** Fired when component becomes ready to be interacted with. */
  @Event({
    eventName: "ready",
    composed: true,
    bubbles: true
  })
  readonly ready: EventEmitter<void>;

  async componentWillLoad() {
    i18n.componentWillLoad.call(this);
  }

  async componentDidLoad() {
    await store.componentDidLoad.call(this);
    this.ready.emit();
  }

  componentDidRender() {
    vaadin.componentDidRender.call(this);
  }

  /**
   * Resolves with a customer object that's guaranteed to contain
   * the `_embedded["fx:subscriptions"]` array with downloaded subscriptions.
   */
  @Method()
  async getRemoteState() {
    const params: GetRequest = {
      zoom: { subscriptions: true }
    };

    let customer: GetResponse<typeof params> | null = null;

    try {
      customer = await getCustomer(this.resolvedEndpoint, params);
    } catch (e) {
      console.error(e);
      const localMessage = this.i18n?.error || this.i18nProvider.en.error;
      this.error = e instanceof APIError ? e.message : localMessage;
      this.isErrorDismissable = this.state.id !== -1;
    }

    return customer;
  }

  /**
   * Resolves with a customer object that's guaranteed to contain
   * the `_embedded["fx:subscriptions"]` array with downloaded subscriptions.
   */
  @Method()
  async getState(forceReload = false) {
    return store.getState.call(this, forceReload);
  }

  /** Sets customer object. */
  @Method()
  async setState(value: Partial<FullGetResponse>) {
    store.setState.call(this, value);

    this.activeItem = null;

    if (this.error.length > 0 && this.state.id !== -1) {
      this.isErrorDismissable = true;
    }

    if (this.state._embedded["fx:subscriptions"].length < this.limit) {
      this.hasMore = false;
      this.start = 0;
    } else {
      this.hasMore = true;
    }
  }

  private scrollIntoView() {
    if (this.root.getBoundingClientRect().top < 0) {
      this.root.scrollIntoView({ behavior: "smooth" });
    }
  }

  private async navigate(direction: "back" | "forward" = "forward") {
    const total = this.state._embedded["fx:subscriptions"].length;
    const newOffset = this.start + this.limit * 2;

    if (direction === "forward" && newOffset > total) {
      this.isLoadingNext = true;

      try {
        const endpoint = `${this.resolvedEndpoint}/subscriptions`;
        const res = await getSubscriptions(endpoint, {
          offset: total,
          limit: this.limit - (total % this.limit)
        });

        this.state._embedded["fx:subscriptions"].push(
          ...res._embedded["fx:subscriptions"]
        );

        this.start += res.returned_items > 0 ? this.limit : 0;
        this.hasMore = res.returned_items + res.offset < res.total_items;
        this.isLoadingNext = false;
      } catch (e) {
        console.error(e);

        const localMessage =
          this.i18n?.error || this.i18nProvider.en.error;

        this.error = e instanceof APIError ? e.message : localMessage;
        this.isErrorDismissable = true;
      }

      await this.setState(this.state);
      this.update.emit(this.state);
    } else {
      this.start += (direction === "back" ? -1 : 1) * this.limit;
    }

    this.scrollIntoView();
  }

  private get resolvedEndpoint() {
    let path = "/s/customer";
    if (this.endpoint.length > 0) return this.endpoint + path;

    const portal = getParentPortal(this.root);
    return portal === null ? path : portal.endpoint + path;
  }

  private handleNextDateChange(item: Subscription, event: Event) {
    const picker = event.target as HTMLInputElement;
    const oldDate = formatDate(new Date(item.next_transaction_date));

    if (picker.value !== oldDate) {
      const [year, month, day] = picker.value.split("-").map(v => parseInt(v));
      const newDate = new Date(year, month - 1, day);

      this.activeItem = { ...item };
      this.activeItem.next_transaction_date = newDate.toISOString();
      this.confirmText = this.i18n.confirmText(this.activeItem, item);
      this.confirm.opened = true;

      setTimeout(() => (picker.value = oldDate));
    }
  }

  private handleFrequencyChange(item: Subscription, event: Event) {
    const select = event.target as HTMLInputElement;

    if (select.value !== item.frequency) {
      this.activeItem = { ...item };
      this.activeItem.frequency = select.value;
      this.confirmText = this.i18n.confirmText(this.activeItem, item);
      this.confirm.opened = true;

      setTimeout(() => (select.value = item.frequency));
    }
  }

  private async handleConfirmOK() {
    const subscription = this.state._embedded["fx:subscriptions"].find(item => {
      return item._links.self.href === this.activeItem._links.self.href;
    });

    const { next_transaction_date: newNextDate } = this.activeItem;
    const { frequency: newFrequency } = this.activeItem;

    const { next_transaction_date: oldNextDate } = subscription;
    const { frequency: oldFrequency } = subscription;

    const hasNewNextDate = newNextDate !== oldNextDate;
    const hasNewFrequency = newFrequency !== oldFrequency;

    subscription.next_transaction_date = newNextDate;
    subscription.frequency = newFrequency;

    try {
      await updateSubscription(this.activeItem._links.self.href, {
        ...(hasNewNextDate ? { next_transaction_date: newNextDate } : {}),
        ...(hasNewFrequency ? { frequency: newFrequency } : {})
      });

      this.update.emit(this.state);
      this.toastTheme = "success";
      this.toastText = this.i18n.updateSuccess;
    } catch (e) {
      console.error(e);

      subscription.next_transaction_date = oldNextDate;
      subscription.frequency = oldFrequency;

      this.toastTheme = "error";
      const localMessage = this.i18n?.error || this.i18nProvider.en.error;
      this.error = e instanceof APIError ? e.message : localMessage;
    }

    this.toast.open();
  }

  render() {
    return (
      <SubscriptionDataTable
        cols={this.cols}
        start={this.start}
        limit={this.limit}
        items={this.state._embedded["fx:subscriptions"]}
        hasMore={this.hasMore}
        messages={this.i18n}
        isLoadingNext={this.isLoadingNext}
        navigate={this.navigate.bind(this)}
        headers={[
          () => this.i18n.duration,
          () => this.i18n.frequency,
          () => this.i18n.picker,
          () => this.i18n.actions
        ]}
        cells={[
          item => <StatusSummary item={item} i18n={this.i18n} />,
          item => (
            <FrequencyPicker
              item={item}
              i18n={this.i18n}
              onChange={event => this.handleFrequencyChange(item, event)}
            />
          ),
          item => (
            <NextDatePicker
              item={item}
              i18n={this.i18n}
              onChange={(e, v) => this.handleNextDateChange(e, v)}
            />
          ),
          item => (
            <ItemActions
              row={this.state._embedded["fx:subscriptions"].indexOf(item)}
              i18n={this.i18n}
              item={item}
            />
          )
        ]}
      >
        <div hidden={this.error.length === 0}>
          <ErrorOverlay
            text={this.error}
            action={this.isErrorDismissable ? this.i18n.close : undefined}
            onAction={() => (this.error = "")}
          />
        </div>

        <ToastPopup
          ref={el => (this.toast = el)}
          theme={this.toastTheme}
          text={this.toastText}
          i18n={this.i18n}
        />

        <ConfirmDialog
          ref={el => (this.confirm = el)}
          text={this.confirmText}
          i18n={this.i18n}
          onOK={() => this.handleConfirmOK()}
        />
      </SubscriptionDataTable>
    );
  }
}
