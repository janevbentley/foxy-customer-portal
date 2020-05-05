import { E2EPage, E2EElement } from "@stencil/core/testing";

export async function replaceText(
  page: E2EPage,
  input: E2EElement,
  newText: string
) {
  const currentValue = await input.getProperty("value");

  for (let i = 0; i < currentValue.length; ++i) {
    await input.press("Backspace");
  }

  await input.type(newText);
  await page.waitForChanges();
}
