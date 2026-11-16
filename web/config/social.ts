/**
 * Social links configuration for Starlight.
 *
 * Add more social links here; Starlight supports icons from the
 * Simple Icons library: https://simpleicons.org/
 */

import type {StarlightUserConfig} from "@astrojs/starlight/types";

export const social: StarlightUserConfig["social"] = [
  {
    icon: "github",
    label: "GitHub",
    href: "https://github.com/{{REPO_OWNER}}/{{REPO_NAME}}",
  },
];
