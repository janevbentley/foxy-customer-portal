import { click } from "../../assets/utils/click";
import { usePage } from "../../assets/utils/usePage";
import { interceptAPIRequests } from "../../assets/utils/interceptAPIRequests";
import { customer } from "../../assets/defaults";

const tag = "foxy-customer-portal";

describe("HTMLFoxyCustomerPortalElement", () => {
  describe("Logged out", () => {
    it("shows signin form", async () => {
      await usePage(async ({ page }) => {
        await page.setContent(`<${tag}></${tag}>`);
        await page.waitForChanges();
        const signIn = await page.find(`${tag} >>> foxy-sign-in`);
        expect(await signIn.isVisible()).toBe(true);
      });
    });
  });

  describe("Logged in", () => {
    const consumers = [
      "foxy-subscriptions",
      "foxy-transactions",
      "foxy-address",
      "foxy-profile"
    ];

    consumers.forEach(consumer => {
      it(`shares state with ${consumer}`, async () => {
        await interceptAPIRequests(async ({ page, url, signIn }) => {
          await signIn();
          await page.setContent(`<${tag} endpoint="${url}"></${tag}>`);
          await page.waitForChanges();

          const root = await page.find(tag);
          const rootState = await root.callMethod("getState");
          const rootLocale = await root.getProperty("locale");
          const rootEndpoint = await root.getProperty("endpoint");
          const child = await page.find(`${tag} >>> ${consumer}`);

          expect(await child.getProperty("locale")).toBe(rootLocale);
          expect(await child.getProperty("endpoint")).toBe(rootEndpoint);
          expect(await child.callMethod("getState")).toEqual(rootState);
        });
      });
    });

    it("shows activity page by default", async () => {
      await interceptAPIRequests(async ({ page, url, signIn }) => {
        await signIn();
        await page.setContent(`<${tag} endpoint="${url}"></${tag}>`);
        await page.waitForChanges();

        for (const child of ["foxy-subscriptions", "foxy-transactions"]) {
          const element = await page.find(`${tag} >>> ${child}`);
          expect(await element.isVisible()).toBe(true);
        }
      });
    });

    it("shows profile page when navigated to", async () => {
      await interceptAPIRequests(async ({ page, url, signIn }) => {
        await signIn();
        await page.setContent(`<${tag} endpoint="${url}"></${tag}>`);
        await page.waitForChanges();
        await click(page, `${tag} >>> [data-e2e=lnk-account]`);

        for (const child of ["foxy-profile", "foxy-address"]) {
          for (const element of await page.findAll(`${tag} >>> ${child}`)) {
            expect(await element.isVisible()).toBe(true);
          }
        }
      });
    });

    it("signs out when the sign out button is clicked", async () => {
      await interceptAPIRequests(async ({ page, url, signIn }) => {
        await signIn();
        await page.setContent(`<${tag} endpoint="${url}"></${tag}>`);
        await page.waitForChanges();
        await click(page, `${tag} >>> [data-e2e=btn-sign-out]`);

        const root = await page.find(tag);
        const foxySignIn = await page.find(`${tag} >>> foxy-sign-in`);
        const cookies = await page.cookies();
        const cookie = cookies.find(v => v.name === "fx.customer");

        if (typeof cookie === "undefined") {
          expect(cookie).toBeUndefined();
        } else {
          expect(cookie.expires).toBe(-1);
        }

        expect(await foxySignIn.isVisible()).toBe(true);
        expect(await root.callMethod("getState")).toMatchObject(customer());
      });
    });

    it("renders additional links with markdown syntax", async () => {
      await interceptAPIRequests(async ({ page, url, signIn }) => {
        const links = "[Foo](http://example.com/0)[Bar](http://example.com/1)";
        const content = `<${tag} endpoint="${url}" tabs="${links}"></${tag}>`;

        await signIn();
        await page.setContent(content);
        await page.waitForEvent("ready");

        const [foo, bar] = await page.findAll(`${tag} >>> vaadin-tab > a`);

        expect(foo.getAttribute("href")).toEqual("http://example.com/0");
        expect(bar.getAttribute("href")).toEqual("http://example.com/1");

        expect(foo).toEqualText("Foo");
        expect(bar).toEqualText("Bar");
      });
    });

    it("renders additional links when using js array", async () => {
      await interceptAPIRequests(async ({ page, url, signIn }) => {
        const tabs = [
          {
            href: "https://foxy.io",
            caption: "Home"
          },
          {
            href: "https://admin.foxycart.com",
            caption: "Admin"
          }
        ];

        await signIn();
        await page.setContent(`<${tag} endpoint="${url}"></${tag}>`);
        await page.waitForEvent("ready");

        const root = await page.find(tag);
        root.setProperty("tabs", tabs);
        await page.waitForChanges();

        const wrappers = await page.findAll(`${tag} >>> vaadin-tab > a`);

        for (let i = 0; i < wrappers.length - 1; ++i) {
          expect(wrappers[i].getAttribute("href")).toEqual(tabs[i].href);
          expect(wrappers[i]).toEqualText(tabs[i].caption);
        }
      });
    });
  });
});
