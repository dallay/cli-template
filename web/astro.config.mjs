// @ts-check

import starlight from "@astrojs/starlight";
import {defineConfig} from "astro/config";

import {base, site, title} from "./config/site.ts";
import {defaultLocale, locales} from "./config/locales.ts";
import {social} from "./config/social.ts";
import {sidebar} from "./config/sidebar.ts";

// https://astro.build/config
export default defineConfig({
  site,
  base,
  integrations: [
    starlight({
      title,
      defaultLocale,
      locales,
      social,
      sidebar,
      customCss: ["./src/styles/custom.css"],
    }),
  ],
});
