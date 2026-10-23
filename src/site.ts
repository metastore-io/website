/**
 * Everything that changes when the name and the domain are settled (LEG-5, OPS-5 in
 * metastore-io/app) lives here, so the swap is one edit. Until then the site runs on GitHub
 * Pages under /website and asks search engines not to index it.
 */
export const site = {
  /** The product name: always one word. */
  name: 'Metastore',
  /** Where the site is served, without a path. With a custom domain: `https://<domain>`. */
  origin: 'https://metastore-io.github.io',
  /** The path the site lives under. GitHub Pages serves this repository at /website; `/` once a custom domain is set. */
  base: '/website',
  /** False while the name and domain are placeholders: every page carries `noindex`. */
  indexable: false,
  /**
   * The public TestFlight link once the external beta opens. Without it the page says the beta
   * opens soon instead of showing a button.
   */
  testflightUrl: undefined as string | undefined,
} as const;

/** A site path such as `/methode` with the base in front, for links and comparisons. */
export const link = (path: string) => `${site.base.replace(/\/$/, '')}${path}` || '/';

/**
 * The site path of a page as `link()` writes it, from the URL Astro renders it under: the build
 * (`build.format: 'file'`) sees `/website/methode.html` and `/website/index.html`, the dev server
 * `/website/methode`. GitHub Pages serves both forms; links and the canonical URL use the short one.
 */
export const pagePath = (pathname: string) =>
  pathname.replace(/\.html$/, '').replace(/(^|\/)index$/, '$1') || '/';

/** The pages in the footer, in order. The bar links only to the method. */
export const pages = [
  { path: '/methode', label: 'So wählen wir aus' },
  { path: '/datenschutz', label: 'Datenschutz' },
  { path: '/impressum', label: 'Impressum' },
] as const;
