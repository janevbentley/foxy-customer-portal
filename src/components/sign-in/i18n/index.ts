import { MessagesProvider } from "../../../mixins/i18n";
import { messages as defaultMessages } from "./en";

export const i18nProvider: MessagesProvider<typeof defaultMessages> = {
  en: () => Promise.resolve(defaultMessages),
  ru: () => import("./ru").then(v => v.messages),
  default: defaultMessages
};
