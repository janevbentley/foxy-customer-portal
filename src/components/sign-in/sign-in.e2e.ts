import faker from "faker";
import { click } from "../../assets/utils/click";
import { interceptAPIRequests } from "../../assets/utils/interceptAPIRequests";

describe("HTMLFoxySignInElement", () => {
  it("displays an error if credentials are invalid", async () => {
    await interceptAPIRequests(async ({ page, url }) => {
      await page.setContent(`<foxy-sign-in endpoint="${url}"></foxy-sign-in>`);
      await page.waitForChanges();

      const email = await page.find("foxy-sign-in >>> [data-e2e=fld-email]");
      const pwd = await page.find("foxy-sign-in >>> [data-e2e=fld-password]");

      await email.type(faker.internet.email());
      await pwd.type(faker.internet.password());
      await click(page, "foxy-sign-in >>> [data-e2e=btn-sign-in]");

      const msg = await page.find("foxy-sign-in >>> [data-e2e=lbl-status]");
      expect(msg.textContent.length).toBeGreaterThan(0);
    });
  });

  it("logs in and saves the auth cookie", async () => {
    await interceptAPIRequests(async ({ page, url, db }) => {
      await page.setContent(`<foxy-sign-in endpoint="${url}"></foxy-sign-in>`);
      await page.waitForChanges();

      const email = await page.find("foxy-sign-in >>> [data-e2e=fld-email]");
      const pwd = await page.find("foxy-sign-in >>> [data-e2e=fld-password]");

      await email.type(db.customer.email);
      await pwd.type(db.password);
      await click(page, "foxy-sign-in >>> [data-e2e=btn-sign-in]");

      const cookie = await page.evaluate(() => document.cookie);
      expect(cookie.includes("fx.customer=")).toBe(true);

      const msg = await page.find("foxy-sign-in >>> [data-e2e=lbl-status]");
      expect(msg.textContent).toEqualText("");
    });
  });

  it("allows visitors to initiate a password reset", async () => {
    await interceptAPIRequests(async ({ page, url, db }) => {
      await page.setContent(`<foxy-sign-in endpoint="${url}"></foxy-sign-in>`);
      await page.waitForChanges();

      const email = await page.find("foxy-sign-in >>> [data-e2e=fld-email]");
      await email.type(db.customer.email);
      await click(page, "foxy-sign-in >>> [data-e2e=btn-reset-pwd]");

      expect(db.passwordResetRequested).toBe(true);
    });
  });
});
