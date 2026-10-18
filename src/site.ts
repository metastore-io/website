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
