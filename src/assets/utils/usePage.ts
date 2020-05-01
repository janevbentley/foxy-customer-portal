import { newE2EPage, E2EPage } from "@stencil/core/testing";

type Handler<T> = (context: T) => Promise<any>;

type PageContext = {
  page: E2EPage;
};

export async function usePage(cb: Handler<PageContext>) {
  const page = await newE2EPage({ url: "/index.e2e.html" });
  await cb({ page });
  await page.close();
}
