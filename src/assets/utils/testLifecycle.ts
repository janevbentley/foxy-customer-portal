import { newSpecPage } from "@stencil/core/testing";
import { Address } from "../../components/address/address";
import { CustomerPortal } from "../../components/customer-portal/customer-portal";
import { Profile } from "../../components/profile/profile";
import { SignIn } from "../../components/sign-in/sign-in";
import { Subscriptions } from "../../components/subscriptions/subscriptions";
import { Transactions } from "../../components/transactions/transactions";

const components = [
  Address,
  CustomerPortal,
  Profile,
  SignIn,
  Subscriptions,
  Transactions
];

export function testLifecycle(tag: string) {
  describe("Lifecycle", () => {
    it(`renders as ${tag} element`, async () => {
      const page = await newSpecPage({ components, html: `<${tag}></${tag}>` });
      expect(page.rootInstance).not.toBeNull();
    });

    it("fires `ready` event upon loading", async done => {
      const page = await newSpecPage({ components });
      page.win.addEventListener("ready", () => done());
      await page.setContent(`<${tag}></${tag}>`);
    });
  });
}
