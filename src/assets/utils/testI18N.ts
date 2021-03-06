import { newSpecPage, SpecPage } from "@stencil/core/testing";
import { Address } from "../../components/address/address";
import { CustomerPortal } from "../../components/customer-portal/customer-portal";
import { Profile } from "../../components/profile/profile";
import { SignIn } from "../../components/sign-in/sign-in";
import { Subscriptions } from "../../components/subscriptions/subscriptions";
import { Transactions } from "../../components/transactions/transactions";
import { Subscription } from "../../components/subscription/subscription";

const components = [
  Address,
  CustomerPortal,
  Profile,
  SignIn,
  Subscriptions,
  Subscription,
  Transactions
];

export function testI18N(tag: string) {
  describe("i18n", () => {
    let page: SpecPage;

    beforeEach(async () => {
      page = await newSpecPage({ components, html: `<${tag}></${tag}>` });
    });

    it("has `locale` property", async () => {
      expect(page.rootInstance).toHaveProperty("locale");
    });

    it("uses en locale when language info is unavailable", async () => {
      expect(page.rootInstance.locale).toBe("en");
    });
  });
}
