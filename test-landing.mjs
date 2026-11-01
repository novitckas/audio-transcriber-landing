import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const pages = [
  ['index.html', 'Audio Transcriber', '2500', '1200', 'Новицкас Станиславас', '345 ₽'],
  ['index-en.html', 'Audio Transcriber', '2500', '1200', null, '$3.99'],
];

for (const [file, name, regularMinutes, speakerMinutes, footer, price] of pages) {
  const html = readFileSync(new URL(file, import.meta.url), 'utf8');
  assert.match(html, new RegExp(`<title>${name}`));
  assert.match(html, /src="minimal_128\.png"/);
  assert.match(html, /https:\/\/chromewebstore\.google\.com\/detail\/audio-transcriber\/ahhnadhojiabmnlnhmpngbidmbmmdaph/);
  assert.match(html, new RegExp(`${regularMinutes}[\\s\\S]*${speakerMinutes}`));
  assert.ok(html.includes(price), `${file} must display ${price}`);
  assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1">/);
  if (footer) assert.match(html, new RegExp(footer));
}

const englishHtml = readFileSync(new URL('index-en.html', import.meta.url), 'utf8');
assert.doesNotMatch(englishHtml, /href="index\.html"/);

for (const [file, title] of [
  ['refund-policy.html', 'Refund Policy'],
  ['privacy-policy.html', 'Privacy Policy'],
  ['terms-of-service.html', 'Terms of Service'],
]) {
  for (const [landing] of pages) {
    const html = readFileSync(new URL(landing, import.meta.url), 'utf8');
    assert.ok(html.includes(`href="${file}"`), `${landing} must link to ${file}`);
  }
  const html = readFileSync(new URL(file, import.meta.url), 'utf8');
  assert.ok(html.includes(`<h1>${title}</h1>`));
  assert.ok(html.includes('href="legal.css"'));
}
readFileSync(new URL('legal.css', import.meta.url), 'utf8');

console.log('Landing page checks passed.');
