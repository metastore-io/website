# Metastore website

The public website of Metastore, the buyer-side shopping helper for Germany: one landing page, the
method, and the privacy policy and Impressum. Plain static HTML built with
[Astro](https://astro.build), no tracking and no cookies. The app and its backend live in
[metastore-io/app](https://github.com/metastore-io/app).

```bash
npm install
npm run dev      # local preview with reload
npm run check    # types
npm test         # builds dist/, then checks every link and the noindex rule
```

## Where things are

- `src/site.ts`: the name, where the site is served (`origin`, `base`), whether search engines may
  index it, and the TestFlight link. The swap to the final name and domain is one edit here.
- `src/pages/`: one file per page. German only for now.
- `src/method.ts`: the method text, copied from the app's German strings. Copy it again when the
  app's text changes.
- `src/styles/tokens.css`: a copy of the app's design tokens. `site.css` uses only these values.
- `src/assets/`: the app's product page from `npm run screens` in the app repo, labelled as test
  data on the page.

## Hosting

GitHub Pages, deployed by `.github/workflows/pages.yml` on every push to `main`; pull requests only
build and check. The repository must stay public for Pages on the free plan. It serves at
`https://metastore-io.github.io/website`.

For a custom domain later: set it under Settings → Pages, add `public/CNAME` with the domain, and in
`src/site.ts` set `origin` to `https://<domain>`, `base` to `/` and `indexable` to `true`.
