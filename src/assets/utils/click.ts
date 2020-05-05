import { E2EPage } from "@stencil/core/testing";

export async function click(page: E2EPage, selector: string) {
  await (await page.find(selector)).click();
  await page.waitForChanges();
}
