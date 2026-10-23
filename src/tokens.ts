/**
 * Reads a value from `styles/tokens.css` at build time, so the few places outside CSS that need a
 * colour (the `theme-color` metas) take it from the tokens instead of repeating a hex value.
 */
export type Scheme = 'light' | 'dark';

/** The first rule of each scheme in tokens.css: `:root, [data-theme="light"]` and `[data-theme="dark"]`. */
const blockStart: Record<Scheme, string> = {
  light: ':root, [data-theme="light"] {',
  dark: '[data-theme="dark"] {',
};

export const tokenValue = (css: string, name: string, scheme: Scheme) => {
  const start = css.indexOf(blockStart[scheme]);
  if (start < 0) throw new Error(`tokens.css has no ${scheme} block`);
  const block = css.slice(start, css.indexOf('}', start));
  const value = new RegExp(`--${name}:\\s*([^;]+);`).exec(block)?.[1]?.trim();
  if (!value) throw new Error(`tokens.css has no --${name} for ${scheme}`);
  return value;
};
