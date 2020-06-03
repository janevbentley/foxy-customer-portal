import { SpecPage, newSpecPage } from "@stencil/core/testing";
import { testLifecycle } from "../../assets/utils/testLifecycle";
import { testStore } from "../../assets/utils/testStore";
import { testI18N } from "../../assets/utils/testI18N";
import { CustomerPortal } from "./customer-portal";

describe("HTMLFoxyCustomerPortalElement", () => {
  testLifecycle("foxy-customer-portal");
  testStore("foxy-customer-portal");
  testI18N("foxy-customer-portal");

  describe("navLinks property", () => {
    let page: SpecPage;

    beforeEach(async () => {
      page = await newSpecPage({
        components: [CustomerPortal],
        html: "<foxy-customer-portal></foxy-customer-portal>"
      });
    });

    it("has `navLinks` property", async () => {
      expect(page.rootInstance).toHaveProperty("navLinks");
    });

    it("uses an empty array as a default value", async () => {
      expect(page.rootInstance.navLinks).toEqual([]);
    });
  });
});
