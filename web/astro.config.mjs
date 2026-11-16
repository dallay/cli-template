// @ts-check

import starlight from "@astrojs/starlight";
import {defineConfig} from "astro/config";

import {base, site, title} from "./config/site.js";
import {defaultLocale, locales} from "./config/locales.js";
import {social} from "./config/social.js";
import {sidebar} from "./config/sidebar.js";

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
