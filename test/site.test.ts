// Checks the built site in dist/ (the test script builds it first): every page links only to
// pages that exist under the base path, and the placeholder site stays out of search engines.
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { site } from '../src/site.ts';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const pages = readdirSync(dist).filter(file => file.endsWith('.html'));

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
}

test('the method page carries the app text with no placeholder left', () => {
  const html = readFileSync(join(dist, 'methode.html'), 'utf8');
  assert.match(html, /Niemand kauft sich einen Platz/);
  assert.doesNotMatch(html, /\{\{/);
});
