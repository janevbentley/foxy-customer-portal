# foxy-subscription



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description                                                       | Type     | Default                           |
| ---------- | ---------- | ----------------------------------------------------------------- | -------- | --------------------------------- |
| `endpoint` | `endpoint` | Foxy Customer Portal API endpoint.                                | `string` | `""`                              |
| `link`     | `link`     | Subscription URL (value of `(fx:subscription)._links.self.href`). | `string` | `""`                              |
| `locale`   | `locale`   | The language to display element content in.                       | `any`    | `i18n.defaults.locale.call(this)` |


## Events

| Event    | Description                                                                                         | Type                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| -------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ready`  | Fired when component becomes ready to be interacted with.                                           | `CustomEvent<void>`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `update` | Emitted after the component makes changes to the state, containing the changed data in its payload. | `CustomEvent<{ date_created: string; date_modified: string; } & { id: number; last_login_date: string; first_name: string; last_name: string; email: string; tax_id: string; is_anonymous: boolean; } & { _embedded: Record<"fx:subscriptions", Subscription[]>; } & { _embedded: Record<"fx:transactions", Transaction[]>; } & { _embedded: Record<"fx:default_billing_address", Address>; } & { _embedded: Record<"fx:default_shipping_address", Address>; } & { _embedded: Record<"fx:default_payment_method", PaymentMethod>; } & Record<"_links", Record<"fx:checkout", Link>> & { _embedded?: { "fx:attributes"?: Attribute[]; }; }>` |


## Methods

### `getRemoteState() => Promise<GetResponse<GetRequest>>`

Resolves with a customer object that's guaranteed to contain
the `_embedded["fx:subscriptions"]` array with downloaded subscriptions.

#### Returns

Type: `Promise<GetResponse<GetRequest>>`



### `getState(forceReload?: boolean) => Promise<any>`

Resolves with a customer object that's guaranteed to contain
the `_embedded["fx:subscriptions"]` array with downloaded subscriptions.

#### Returns

Type: `Promise<any>`



### `setFrequency(newValue: string) => Promise<void>`

Sets frequency.

#### Returns

Type: `Promise<void>`



### `setNextTransactionDate(newValue: string | Date) => Promise<void>`

Sets next transaction date.

#### Returns

Type: `Promise<void>`



### `setState(value: Partial<GetResponse<{ zoom: Record<"default_billing_address" | "default_shipping_address" | "subscriptions" | "transactions" | "default_payment_method", true>; sso: true; }>>) => Promise<void>`

Sets customer object.

#### Returns

Type: `Promise<void>`




## Dependencies

### Used by

 - [foxy-subscriptions](../subscriptions)

### Graph
```mermaid
graph TD;
  foxy-subscriptions --> foxy-subscription
  style foxy-subscription fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
