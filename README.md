# Foxy Customer Portal

A collection of web components created for displaying customer portal info. This is the package devs will use most often, and likely from the CDN such as unpkg.com (if we publish on npm). This collection includes both the quick and easy way to add the customer portal to the page and an option to customize the look or behaviour of the components.

This package is work in progress. Event types, component tag names and other implementation details can be changed before the release.

## Overview

All public web components in this package are stateful and independent, meaning that they can be used both with or without `foxy-customer-portal`.

Adding a customer portal is as simple as putting the respective element in your markup:

```html
<foxy-customer-portal
  endpoint="https://foxy-demo.foxycart.com"
></foxy-customer-portal>
```

`foxy-customer-portal` includes the default setup (sign in form, transactions list, a few details about customer and a sign out button at the moment of writing) and aggregates the state from all of the child components. Here's how it works (using the transactions component as an example):

1. User loads up the page containing the portal;
2. `foxy-customer-portal`:
   - fetches the initial state;
   - looks for the child `foxy-` elements;
   - calls `.setState()` on each one of them;
3. Portal is ready, user scrolls down and clicks the "Next" button of the transactions component;
4. `foxy-transactions`:
   - fetches a subset of transaction list;
   - sets its own state via `.setState()`;
   - dispatches `CustomEvent<FoxyCustomer>` (type `update`);
5. `foxy-customer-portal`:
   - registers the `update` event as it reaches the element;
   - extracts the new state from `CustomEvent.detail`;
   - merges the new state with its own;
   - looks for the child `foxy-` elements;
   - calls `.setState()` on each one of them;
6. The `update` event continues to bubble up the DOM tree, becoming available to the custom event handlers set on parent elements or the portal itself.

This makes all custom elements from this package aware of each other, while also keeping the implementation details hidden in respective components. A similar approach is used for sign-in/sign-out where `foxy-sign-in` component dispatches the `signin` event that other elements can react to. The `signout` event will be emitted on logout respectively.

Whether you're using the default setup or customizing the portal, you should always attach your event handlers to the `foxy-customer-portal` and not its child elements.

If the default setup doesn't work for the user, they can customize or override it completely using named slots. The following example adds a message to the top of the portal:

```html
<foxy-customer-portal endpoint="https://foxy-demo.foxycart.com">
  <h1>Hello humans!</h1>
</foxy-customer-portal>
```

If you'd like to render the state from `foxy-customer-portal` in your template, you can use any templating engine or DOM library such as React, Vue, lit-html etc. Please note that you'll need to load and initialize it separately (if required).

You can read state using the `.getState()` method of `foxy-customer-portal` once the component is loaded. You'll most likely want to keep a local copy of the state if you're using Vue or React – to make sure it updates with the portal, subscribe to the `update` event on `foxy-customer-portal` (you'll receive the entire state in `CustomEvent["detail"]`). To propagate your own updates across the page, call the `.setState()` method of the portal with the updated state. Here's an example of what it would look like in Vue:

```html
<template>
  <foxy-customer-portal
    ref="portal"
    endpoint="https://foxy-demo.foxycart.com"
    @update="e => this.customer = e.detail"
  >
    <!-- Displays a greeting if user is logged in -->
    <h1>Welcome back, {{customer.first_name}}!</h1>
    <button @click="customer.first_name = 'Michael'">Change name</button>
  </foxy-customer-portal>
</template>

<script>
  export default {
    data: () => ({
      customer: {
        // Placeholder value (optional)
        first_name: ""
      }
    }),
    watch: {
      customer: {
        deep: true,
        async handler(newValue) {
          await customElements.whenDefined("foxy-customer-portal");
          await this.$refs.portal.setState(newValue);
        }
      }
    }
  };
</script>
```

A complete override is also possible at any level, but keep in mind that the respective events will need to be emitted explicitly if built-in elements are removed from the setup as the result:

```html
<foxy-customer-portal endpoint="https://foxy-demo.foxycart.com">
  <my-custom-element slot="subscriptions" />
  <!-- Don't forget to emit foxy:sync with subscriptions when you fetch them! -->
</foxy-customer-portal>
```

_Hint:_ you can assign multiple elements to a single slot:

```html
<foxy-customer-portal endpoint="https://foxy-demo.foxycart.com">
  <h1 slot="subscriptions">Hello, humans!</h1>
  <my-custom-element slot="subscriptions" />
</foxy-customer-portal>
```

## Usage

### Browser

```html
<script type="module" src="/path/to/package/dist/foxy/foxy.esm.js"></script>
<script nomodule src="/path/to/package/dist/foxy/foxy.js"></script>

<foxy-customer-portal
  endpoint="https://your-api-endpoint.tld"
></foxy-customer-portal>
```

If you aren't doing subscriptions or downloadables, you can override those elements by defining empty divs in their slots, like this:

```html
<foxy-customer-portal endpoint="https://your-api-endpoint.tld">
  <div slot="subscriptions-container"></div>
  <div slot="downloadables-container"></div>
</foxy-customer-portal>
```

### Vue

```html
<div id="customer-portal">
  <foxy-customer-portal
    endpoint="https://your-api-endpoint.tld"
  ></foxy-customer-portal>
</div>
```

```js
import Vue from "vue";
import {
  applyPolyfills,
  defineCustomElements
} from "@foxy/customer-portal/loader";

Vue.config.ignoredElements.push(/foxy-\w*/);
applyPolyfills().then(() => defineCustomElements(window));

new Vue({ el: "#customer-portal" });
```

## Development

Stencil docs are a good place to start if you're unsure because this package follows the standard structure. This project is also using [TSX/TypeScript](https://typescriptlang.org/) and [Rollup](https://rollupjs.org).

Commands:

```bash
# serve dev version
npm run serve:material
npm run serve:lumo

# build the library with docs
npm run build

# run linters
npm run lint

# commit with commitizen
npm run commit
```
