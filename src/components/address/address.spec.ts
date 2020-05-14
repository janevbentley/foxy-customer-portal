import { testLifecycle } from "../../assets/utils/testLifecycle";
import { testStore } from "../../assets/utils/testStore";
import { testI18N } from "../../assets/utils/testI18N";
import { mockFetch } from "../../assets/utils/mockFetch";
import { newSpecPage, SpecPage } from "@stencil/core/testing";
import { Address } from "./address";
import { mockDatabase } from "../../assets/utils/mockDatabase";

describe("HTMLFoxyAddressElement", () => {
  testLifecycle("foxy-address");
  testStore("foxy-address");
  testI18N("foxy-address");

  describe("Interface", () => {
    let page: SpecPage;

    beforeEach(async () => {
      page = await newSpecPage({
        components: [Address],
        html: "<foxy-address></foxy-address>"
      });
    });

    it("has `type` property", async () => {
      expect(page.rootInstance).toHaveProperty("type");
      expect(page.rootInstance.type).toBe("default_billing_address");
    });

    it("has `reset()` method that resolves with `undefined`", async () => {
      expect(page.rootInstance).toHaveProperty("reset");
      expect(typeof page.rootInstance.reset).toBe("function");
      expect(await page.rootInstance.reset()).toBeUndefined();
    });

    it("has `submit()` method that saves address data", async () => {
      expect(page.rootInstance).toHaveProperty("submit");
      expect(typeof page.rootInstance.submit).toBe("function");

      const { billingAddress } = await mockDatabase();
      const embedKey = "fx:default_billing_address";

      page.win.fetch = await mockFetch();
      page.doc.cookie = "fx.customer=any";

      await page.rootInstance.setState({
        _embedded: { [embedKey]: billingAddress }
      });

      const submitResult = await page.rootInstance.submit();
      const newState = await page.rootInstance.getState();

      const newCustomer = await (
        await page.win.fetch("/s/customer?zoom=default_billing_address", {
          headers: { "fx.customer": "any" }
        })
      ).json();

      expect(submitResult).toBeUndefined();
      expect(newState._embedded[embedKey]).toMatchObject(billingAddress);
      expect(newCustomer._embedded[embedKey]).toMatchObject(billingAddress);
    });
  });
});
