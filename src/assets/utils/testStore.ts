import { newSpecPage, SpecPage } from "@stencil/core/testing";
import { Address } from "../../components/address/address";
import { CustomerPortal } from "../../components/customer-portal/customer-portal";
import { Profile } from "../../components/profile/profile";
import { SignIn } from "../../components/sign-in/sign-in";
import { Subscriptions } from "../../components/subscriptions/subscriptions";
import { Transactions } from "../../components/transactions/transactions";
import { mockDatabase } from "./mockDatabase";
import { handlers } from "../handlers";
import { customer } from "../defaults";
import { mockFetch } from "./mockFetch";

const components = [
  Address,
  CustomerPortal,
  Profile,
  SignIn,
  Subscriptions,
  Transactions
];

const fullZoom = [
  "default_billing_address",
  "default_shipping_address",
  "default_payment_method",
  "subscriptions",
  "transactions"
];

export function testStore(tag: string) {
  describe("Store", () => {
    let page: SpecPage;

    beforeEach(async () => {
      page = await newSpecPage({ components, html: `<${tag}></${tag}>` });
    });

    it("has `endpoint` property", async () => {
      expect(page.rootInstance).toHaveProperty("endpoint");
    });

    it("uses current path as default endpoint", async () => {
      expect(page.rootInstance.endpoint).toEqualText("");
    });

    it("has `getState()` method", async () => {
      expect(page.rootInstance).toHaveProperty("getState");
      expect(typeof page.rootInstance.getState).toEqual("function");
    });

    it("has `getRemoteState()` method", async () => {
      expect(page.rootInstance).toHaveProperty("getRemoteState");
      expect(typeof page.rootInstance.getState).toEqual("function");
    });

    it("has `setState()` method", async () => {
      expect(page.rootInstance).toHaveProperty("setState");
      expect(typeof page.rootInstance.getState).toEqual("function");
    });

    it("contains empty state by default", async () => {
      expect(await page.rootInstance.getState()).toEqual(customer());
    });

    it("merges partial state passed with `setState()`", async () => {
      const url = `/s/customer?zoom=${fullZoom}&sso=true`;
      const getHandler = handlers.find(v => v.test("GET", url));
      const db = await mockDatabase();

      const { body: newState } = await getHandler.run(db, {
        method: "GET",
        headers: { "fx.customer": "any" },
        body: "",
        url
      });

      await page.rootInstance.setState(newState);
      expect(await page.rootInstance.getState()).toMatchObject(newState);
    });

    it("fetches a fresh remote state without updating the local one`", async () => {
      page.doc.cookie += "fx.customer=any";
      page.win.fetch = await mockFetch("/");

      const headers = { "fx.customer": "any" };
      const partialCustomer = await page.rootInstance.getRemoteState();
      const fullCustomer = await page.win.fetch(
        `/s/customer?zoom=${fullZoom}&sso=true`,
        { headers }
      );

      expect(await fullCustomer.json()).toMatchObject(partialCustomer);
    });

    it("syncs the local state with the remote data, emitting `update` event", async () => {
      page.win.fetch = await mockFetch("/");

      const update = jest.fn();
      page.win.addEventListener("update", update);

      page.doc.cookie = "fx.customer=any";
      const expected = await page.rootInstance.getRemoteState();

      page.doc.cookie = "fx.customer=any";
      const received = await page.rootInstance.getState(true);

      expect(received).toMatchObject(expected);
      expect(update).toHaveBeenCalled();
    });
  });
}
