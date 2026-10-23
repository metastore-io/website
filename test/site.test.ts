// Checks the built site in dist/ (the test script builds it first): every page links only to
// pages that exist under the base path, the placeholder site stays out of search engines, and each
// page carries its head (canonical, sharing, theme colour, security) and the basics of access.
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { link, pages as footerPages, site } from '../src/site.ts';
import { tokenValue } from '../src/tokens.ts';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const pages = readdirSync(dist).filter(file => file.endsWith('.html'));

const tokens = readFileSync(fileURLToPath(new URL('../src/styles/tokens.css', import.meta.url)), 'utf8');

/** The site path of a built file, as link() writes it. */
const pathOf = (page: string) => link(page === 'index.html' ? '/' : `/${page.replace(/\.html$/, '')}`);

/** The `content` of a `<meta>` named or with the property `key`, every match. */
const metas = (html: string, key: string) =>
  [...html.matchAll(/<meta\s[^>]*>/g)]
    .map(m => m[0])
    .filter(tag => ['name', 'property', 'http-equiv'].some(kind => tag.includes(`${kind}="${key}"`)))
    .map(tag => /content="([^"]*)"/.exec(tag)?.[1] ?? '');

const one = (html: string, pattern: RegExp) => {
  const found = [...html.matchAll(pattern)];
  assert.equal(found.length, 1, `expected one match of ${pattern}, found ${found.length}`);
  return found[0]![1]!;
};

const fileFor = (path: string) => {
  const base = site.base.replace(/\/$/, '');
  const clean = path.split(/[?#]/)[0]!.slice(base.length) || '/';
  if (clean === '/') return join(dist, 'index.html');
  return existsSync(join(dist, clean)) ? join(dist, clean) : join(dist, `${clean}.html`);
};

test('builds the start, method, privacy and Impressum pages', () => {
  assert.deepEqual(pages.toSorted(), [
    'datenschutz.html',
    'impressum.html',
    'index.html',
    'methode.html',
  ]);
});

for (const page of pages) {
  const html = readFileSync(join(dist, page), 'utf8');

  test(`${page} links only to pages and files that exist`, () => {
    const targets = [...html.matchAll(/(?:href|src|srcset)="(\/[^"]*)"/g)].map(m => m[1]!);
    assert.ok(targets.length > 0);
    for (const target of targets) {
      assert.ok(target.startsWith(site.base), `${target} is outside ${site.base}`);
      assert.ok(existsSync(fileFor(target)), `${target} is missing`);
    }
  });

  test(`${page} is German and ${site.indexable ? 'indexable' : 'kept out of search engines'}`, () => {
    assert.match(html, /<html lang="de"/);
    assert.equal(html.includes('name="robots" content="noindex"'), !site.indexable);
  });

  test(`${page} has one h1, a canonical URL and the sharing metas`, () => {
    assert.equal(html.match(/<h1[\s>]/g)?.length, 1);
    const canonical = one(html, /<link rel="canonical" href="([^"]*)"/g);
    assert.equal(canonical, `${site.origin}${pathOf(page)}`);
    assert.deepEqual(metas(html, 'og:url'), [canonical]);
    assert.deepEqual(metas(html, 'og:type'), ['website']);
    assert.deepEqual(metas(html, 'og:locale'), ['de_DE']);
    assert.deepEqual(metas(html, 'og:site_name'), [site.name]);
    assert.deepEqual(metas(html, 'og:title'), [one(html, /<title>([^<]*)<\/title>/g)]);
    assert.deepEqual(metas(html, 'og:description'), metas(html, 'description'));
    assert.deepEqual(metas(html, 'twitter:card'), ['summary']);
  });

  test(`${page} takes its theme colours from the tokens and locks down what it loads`, () => {
    assert.deepEqual(metas(html, 'theme-color'), [
      tokenValue(tokens, 'color-background-background', 'light'),
      tokenValue(tokens, 'color-background-background', 'dark'),
    ]);
    assert.deepEqual(metas(html, 'referrer'), ['same-origin']);
    const [csp] = metas(html, 'content-security-policy');
    assert.ok(csp, 'no content security policy');
    for (const directive of ["default-src 'none'", "base-uri 'none'", "form-action 'none'"]) {
      assert.ok(csp.includes(directive), `CSP lacks ${directive}`);
    }
    assert.doesNotMatch(csp, /unsafe-inline/);
    // The policy allows no inline code, so the pages must have none.
    assert.doesNotMatch(html, /<script|<style|\sstyle="/);
    assert.doesNotMatch(html, /<!--/, 'an HTML comment reached the published page');
  });

  test(`${page} has a skip link to its main content and describes every image`, () => {
    assert.match(html, /<body[^>]*>\s*<a class="skip" href="#inhalt">Zum Inhalt springen<\/a>/);
    assert.match(html, /<main id="inhalt"/);
    for (const [img] of html.matchAll(/<img\s[^>]*>/g)) {
      for (const attribute of ['alt', 'width', 'height']) {
        assert.match(img, new RegExp(`\\s${attribute}="[^"]+"`), `${img} lacks ${attribute}`);
      }
    }
  });

  test(`${page} marks only links to itself as the current page`, () => {
    const current = [...html.matchAll(/<a\s[^>]*aria-current="page"[^>]*>/g)].map(
      m => /href="([^"]*)"/.exec(m[0])?.[1],
    );
    const inBar = pathOf(page) === link('/methode') ? 1 : 0;
    const inFooter = footerPages.filter(p => link(p.path) === pathOf(page)).length;
    assert.equal(current.length, inBar + inFooter);
    for (const href of current) assert.equal(href, pathOf(page));
  });
}

test('every page has its own title and description', () => {
  const heads = pages.map(page => {
    const html = readFileSync(join(dist, page), 'utf8');
    const title = one(html, /<title>([^<]*)<\/title>/g);
    return { title, description: metas(html, 'description')[0] };
  });
  for (const { title, description } of heads) {
    assert.ok(title.trim() && description?.trim());
  }
  assert.equal(new Set(heads.map(h => h.title)).size, pages.length);
  assert.equal(new Set(heads.map(h => h.description)).size, pages.length);
});

test('the method page carries the app text with no placeholder left', () => {
  const html = readFileSync(join(dist, 'methode.html'), 'utf8');
  assert.match(html, /Niemand kauft sich einen Platz/);
  assert.match(html, /Wann ein Preis gut ist/);
  assert.match(html, /in den letzten 90 Tagen/);
  assert.doesNotMatch(html, /\{\{/);
  // The app's voice never says "KI" (metastore-io/app AGENTS.md).
  assert.doesNotMatch(html, /\bKI\b/);
});
