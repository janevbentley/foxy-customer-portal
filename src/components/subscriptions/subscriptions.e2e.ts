import { click } from "../../assets/utils/click";
import { usePage } from "../../assets/utils/usePage";
import { interceptAPIRequests } from "../../assets/utils/interceptAPIRequests";
import { E2EElement } from "@stencil/core/dist/testing";
import { Subscription } from "../../assets/types/Subscription";
import { i18nProvider } from "./i18n";
import { formatDate } from "./NextDatePicker";

const tag = "foxy-subscriptions";

describe("HTMLFoxySubscriptionsElement", () => {
  const templates = [
    `<${tag}></${tag}>`,
    `<${tag} cols="6"></${tag}>`,
    `<${tag} locale="ru"></${tag}>`,
    `<${tag} endpoint="http://i.dont.exist.local"></${tag}>`
  ];

  const descriptions = [
    "zero config",
    "custom cols",
    "custom locale",
    "custom endpoint url"
  ];

  describe("logged out: displays empty state", () => {
    descriptions.forEach((testDescription, templateIndex) => {
      it(testDescription, async () => {
        await usePage(async ({ page }) => {
          await page.setContent(templates[templateIndex]);
          await page.waitForChanges();

          const tbody = await page.find(`${tag} >>> tbody`);
          expect(tbody).toEqualText("");
        });
      });
    });
  });

  describe("authorized:", () => {
    it("displays subscriptions from a remote source", async () => {
      await interceptAPIRequests(async ({ db, url, page, signIn }) => {
        await signIn();
        await page.setContent(`<${tag} endpoint="${url}"></${tag}>`);
        await page.waitForChanges();

        const rows = await page.findAll(`${tag} >>> tbody tr`);

        expect(rows.length).toBeGreaterThan(0);
        expect(rows.length).toBeLessThanOrEqual(db.subscriptions.length);

        for (let i = 0; i < rows.length; ++i) {
          await shouldDisplay(rows[i], db.subscriptions[i]);
        }
      });
    });

    it("navigates forwards and backwards", async () => {
      await interceptAPIRequests(async ({ db, url, page, signIn }) => {
        await signIn();
        await page.setContent(`<${tag} endpoint="${url}"></${tag}>`);
        await page.waitForChanges();

        let rows = await page.findAll(`${tag} >>> tbody tr`);
        let offset = rows.length;
        await click(page, `${tag} >>> [data-e2e=btn-next]`);

        for (let i = 0; i < rows.length; ++i) {
          await shouldDisplay(rows[i], db.subscriptions[offset + i]);
        }

        await click(page, `${tag} >>> [data-e2e=btn-prev]`);
        offset -= rows.length;
        rows = await page.findAll(`${tag} >>> tbody tr`);

        for (let i = 0; i < rows.length; ++i) {
          await shouldDisplay(rows[i], db.subscriptions[offset + i]);
        }
      });
    });

    it("allows changing next transaction date", async () => {
      await interceptAPIRequests(async ({ db, url, page, signIn }) => {
        await signIn();
        await page.setContent(`<${tag} endpoint="${url}"></${tag}>`);
        await page.waitForChanges();

        const picker = await page.find(`${tag} >>> [data-e2e=fld-date]`);
        const value: string = await picker.getProperty("value");
        const [year, month, day] = value.split("-").map(v => parseInt(v));

        const newDate = new Date(year, month - 1, day);
        newDate.setDate(newDate.getDate() + 7);
        const newValue = formatDate(newDate);

        await page.evaluate(
          (tag, newValue) => {
            const root = document.querySelector(tag);
            const picker = root.shadowRoot.querySelector("[data-e2e=fld-date]");
            picker.value = newValue;
            picker.dispatchEvent(new Event("change"));
          },
          tag,
          newValue
        );

        await page.waitForSelector("[data-e2e=btn-ok]");
        await page.waitFor(1000);
        await click(page, "[data-e2e=btn-ok]");
        await page.waitFor(1000);

        const updatedItem = db.subscriptions.find(
          v => v.next_transaction_date === newDate.toISOString()
        );

        expect(await picker.getProperty("value")).toBe(newValue);
        expect(updatedItem).not.toBeUndefined();
      });
    });
  });
});

async function shouldDisplay(row: E2EElement, item: Subscription) {
  const i18n = i18nProvider.default;

  const cells = await row.findAll("td");
  const freqPicker = await cells[1].find("[data-e2e=fld-freq]");
  const datePicker = await cells[2].find("[data-e2e=fld-date]");
  const updateLink = await cells[3].find("[data-e2e=lnk-update]");
  const cancelLink = await cells[3].find("[data-e2e=lnk-cancel]");

  const status = cells[0].textContent;
  expect(status.includes(i18n.statusDescription(item))).toBe(true);

  expect(await freqPicker.getProperty("value")).toEqual(item.frequency);

  expect(await datePicker.getProperty("value")).toBe(
    formatDate(new Date(item.next_transaction_date))
  );

  expect(await updateLink.getProperty("href")).toBe(
    `${item._links["fx:sub_token_url"].href.toLowerCase()}&cart=checkout`
  );

  expect(await cancelLink.getProperty("href")).toBe(
    `${item._links["fx:sub_token_url"].href.toLowerCase()}&sub_cancel=true`
  );
}
