export type Language = "en" | "ru";

export type Override<T extends Partial<Record<string, any>>> = Partial<
  Record<Language, T>
>;

export type MessagesProvider<T = any> = {
  en: () => Promise<T>;
  ru: () => Promise<T>;
  default: T;
};

export abstract class Mixin<T extends MessagesProvider> {
  i18n: Record<string, any> | null;
  i18nProvider: T;
  locale: string | Override<T["default"]>;
  onLocaleChange: (newValue: string | Override<T["default"]>) => void;
  componentWillLoad: () => any;
}

function findBestProvidedLang<T extends MessagesProvider, L extends string>(
  this: Mixin<T>,
  languages: L[]
): L {
  for (const language of languages) {
    if (language in this.i18nProvider) return language;

    const part = language.substr(0, 2);
    if (part in this.i18nProvider) return language;
  }

  return languages[0];
}

function findBestSupportedLang<T extends MessagesProvider>(
  this: Mixin<T>,
  languages: string[]
): keyof T {
  for (const language of languages) {
    if (language in this.i18nProvider) return language as keyof T;

    const part = language.substr(0, 2);
    if (part in this.i18nProvider) return part as keyof T;
  }

  return "default";
}

export const defaults = {
  locale<T extends MessagesProvider>(
    this: Mixin<T>
  ): Override<T["default"]> | string {
    return findBestSupportedLang.call(this, navigator.languages ?? []);
  }
};

export async function onLocaleChange<T extends MessagesProvider>(
  this: Mixin<T>,
  newValue: Override<T["default"]> | string
) {
  let lang = "default";
  let base = this.i18nProvider.default;
  let overrides = {} as Partial<T["default"]>;

  if (typeof newValue === "string") {
    lang = findBestSupportedLang.call(this, [newValue]);
  } else {
    const given = Object.keys(newValue);
    const closest = findBestProvidedLang.call(this, given);

    overrides = newValue[closest];
    lang = findBestSupportedLang.call(this, given);
  }

  try {
    if (lang !== "default") base = await this.i18nProvider[lang]();
  } catch (e) {
    console.error(e);
  }

  this.i18n = { ...base, ...overrides };
}

export async function componentWillLoad<T extends MessagesProvider>(
  this: Mixin<T>
) {
  this.onLocaleChange(this.locale);
}
