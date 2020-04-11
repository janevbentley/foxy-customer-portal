import { E2EPage } from "@stencil/core/testing";
import faker from "faker";
import { PageEventObj } from "puppeteer";
import { handlers } from "../handlers";
import { DB, mockDatabase } from "./mockDatabase";
import { usePage } from "./usePage";

type Handler<T> = (context: T) => Promise<any>;

type MockAPIContext = {
  signIn: () => Promise<void>;
  page: E2EPage;
  url: string;
  db: DB;
};

export async function interceptAPIRequests(cb: Handler<MockAPIContext>) {
  const url = "https://foxy.local";
  const db = await mockDatabase(`${url}/s/customer/`);

  const handleRequest = async (request: PageEventObj["request"]) => {
    if (request.isNavigationRequest() || Boolean(request.response())) return;
    if (request.url().startsWith(url)) {
      const relativeURL = request.url().replace(url, "");
      const handler = handlers.find(h => h.test(request.method(), relativeURL));
      if (Boolean(handler)) {
        const { status, body } = await handler.run(db, {
          headers: request.headers(),
          body: request.postData(),
          url: relativeURL,
          method: request.method()
        });
        return request.respond({
          contentType: "application/json",
          body: JSON.stringify(body),
          status
        });
      }
    }
    await request.continue();
  };

  await usePage(async ({ page }) => {
    const signIn = async () => {
      await page.setCookie({
        name: "fx.customer",
        value: faker.random.alphaNumeric(128),
        url: "http://localhost:8080"
      });
    };

    page.on("request", handleRequest);
    await page.setRequestInterception(true);
    await cb({ db, url, page, signIn });

    page.off("request", handleRequest);
    await page.setRequestInterception(false);
  });
}
