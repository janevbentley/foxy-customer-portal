import { E2EPage } from "@stencil/core/dist/testing";
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
  const origin = "https://foxy.local";
  const db = await mockDatabase(`${origin}/s/customer/`);

  const handleRequest = async (request: PageEventObj["request"]) => {
    if (request.isNavigationRequest() || Boolean(request.response())) return;

    if (request.url().startsWith(origin)) {
      let relativeURL = request.url().replace(`${origin}/s/customer`, "");
      if (!relativeURL.startsWith("/")) relativeURL = `/${relativeURL}`;

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
      } else {
        return request.respond({
          contentType: "application/json",
          status: 500,
          body: JSON.stringify({
            code: 500,
            message: `No handler found for ${request.url()}`
          })
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
    await cb({ db, url: origin, page, signIn });

    page.off("request", handleRequest);
    await page.setRequestInterception(false);
  });
}
