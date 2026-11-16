/**
 * Sidebar configuration for Starlight.
 *
 * Each group maps to a top-level sidebar section.
 * Add new groups or items here as the documentation grows.
 */

import type {SidebarEntry} from "@astrojs/starlight/types";

export const sidebar: SidebarEntry[] = [
  {
    label: "Getting Started",
    translations: {es: "Primeros pasos"},
    items: [
      {label: "Introduction", translations: {es: "Introducción"}, slug: "guides/getting-started"},
      {label: "Usage", translations: {es: "Uso"}, slug: "guides/usage"},
    ],
  },
  {
    label: "Concepts",
    translations: {es: "Conceptos"},
    items: [
      {label: "Architecture", translations: {es: "Arquitectura"}, slug: "concepts/architecture"},
    ],
  },
  {
    label: "Reference",
    translations: {es: "Referencia"},
    items: [
      {label: "CLI Reference", translations: {es: "Referencia de la CLI"}, slug: "reference/cli"},
    ],
  },
  {
    label: "Contributing",
    translations: {es: "Contribuir"},
    items: [
      {label: "Contributing Guide", translations: {es: "Guía de contribución"}, slug: "contributing/contributing"},
    ],
  },
];
