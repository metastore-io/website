# Agent instructions

The Metastore website. The standing rules of [metastore-io/app](https://github.com/metastore-io/app/blob/main/AGENTS.md)
apply here too; this file adds what is specific to the site.

- The name is written **Metastore**, one word, everywhere.
- Static HTML only: no server, no tracking, no cookies, no third-party scripts or fonts. Hosting
  stays free (GitHub Pages).
- Text is German, the app's tone: plain, calm, no superlatives. Every claim is a rule the app
  enforces; never promise what it does not do.
- The look follows the app: the system font, white content edge to edge, hairline rows, no boxes,
  glass only on the bar. Colours, type, spacing and radii only from `src/styles/tokens.css`.
- Links go through `link()` from `src/site.ts`, so the base path can change.
- The privacy policy and Impressum hold legal text: change them only with Marvin's approval.
- Before a push: `npm run check` and `npm test`. Conventional Commits, rebase not merge.
- A visual change shows screenshots (phone and desktop, light and dark) before it merges.
