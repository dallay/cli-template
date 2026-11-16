/**
 * Site-level configuration for Astro.
 *
 * - `site`: Base URL of the deployed site.
 * - `base`: Path prefix for all assets (used for GitHub Pages sub-path).
 * - `title`: Project title shown in the Starlight header.
 */

export const site = "https://{{REPO_OWNER}}.github.io";
export const base = "/{{REPO_NAME}}";
export const title = "{{PROJECT_NAME}}";
