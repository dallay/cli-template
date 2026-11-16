/**
 * Locale configuration for Starlight.
 *
 * Add new locales here following the Starlight i18n guide:
 * https://starlight.astro.build/guides/i18n/
 */

import type {StarlightUserConfig} from "@astrojs/starlight/types";

export const locales: StarlightUserConfig["locales"] = {
  en: {label: "English"},
  es: {label: "Español", lang: "es"},
};

export const defaultLocale: StarlightUserConfig["defaultLocale"] = "en";
