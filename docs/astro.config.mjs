// @ts-check

import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL || "https://{{REPO_OWNER}}.github.io/{{REPO_NAME}}",
  base: process.env.BASE_PATH || "/{{REPO_NAME}}",
  integrations: [
    starlight({
      title: process.env.PROJECT_TITLE || "{{PROJECT_NAME}}",
      defaultLocale: "en",
      locales: {
        en: { label: "English" },
        es: { label: "Español", lang: "es" },
      },
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: process.env.GITHUB_REPO_URL || "https://github.com/{{REPO_OWNER}}/{{REPO_NAME}}",
        },
      ],
      sidebar: [
        {
          label: "Getting Started",
          translations: { es: "Primeros pasos" },
          items: [
            {
              label: "Introduction",
              translations: { es: "Introducción" },
              slug: "guides/getting-started",
            },
            {
              label: "Usage",
              translations: { es: "Uso" },
              slug: "guides/usage",
            },
          ],
        },
        {
          label: "Concepts",
          translations: { es: "Conceptos" },
          items: [
            {
              label: "Architecture",
              translations: { es: "Arquitectura" },
              slug: "concepts/architecture",
            },
          ],
        },
        {
          label: "Reference",
          translations: { es: "Referencia" },
          items: [
            {
              label: "CLI Reference",
              translations: { es: "Referencia de la CLI" },
              slug: "reference/cli",
            },
          ],
        },
        {
          label: "Contributing",
          translations: { es: "Contribuir" },
          items: [
            {
              label: "Contributing Guide",
              translations: { es: "Guía de contribución" },
              slug: "contributing/contributing",
            },
          ],
        },
      ],
      customCss: ["./src/styles/custom.css"],
    }),
  ],
});
