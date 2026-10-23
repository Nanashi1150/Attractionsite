import test from 'node:test';
import assert from 'node:assert/strict';
import { create, act } from 'react-test-renderer';
import { safeExternalUrl, safeImageSource, matchesImageSignature, MAX_DATA_IMAGE_LENGTH } from '../src/app/utils/contentSafety';
import { normalizeAttraction, normalizeCatalogue, parseStoredCatalogue, MAX_ATTRACTIONS, MAX_CATALOGUE_LENGTH } from '../src/app/utils/catalogueStorage';
import { mockAttractions } from '../src/app/types/TouristAttraction';
import { ImageWithFallback } from '../src/app/components/figma/ImageWithFallback';
import { productionContentSecurityPolicy, responseSecurityHeaders } from '../config/security.mjs';

const image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aB9sAAAAASUVORK5CYII=';
test('reference URLs reject executable schemes, control characters and embedded credentials', () => {
  for (const url of ['javascript:alert(1)', 'java\nscript:alert(1)', 'data:text/html,<script>alert(1)</script>', 'vbscript:msgbox(1)', '//attacker.example', 'https://user:password@example.com', {}, null]) {
    assert.equal(safeExternalUrl(url), undefined);
    assert.equal(normalizeAttraction({ ...mockAttractions[0], sourceUrl: url }), null);
  }
  assert.equal(safeExternalUrl('https://example.com/info?q=temple'), 'https://example.com/info?q=temple');
});
test('image validation blocks SVG/HTML data, false MIME labels, traversal and oversized payloads', () => {
  for (const source of ['javascript:alert(1)', 'data:image/svg+xml;base64,PHN2ZyBvbmxvYWQ9YWxlcnQoMSk+', 'data:text/html;base64,PHNjcmlwdD4=', 'data:image/png;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==', image.replace('image/png', 'image/jpeg'), '/images/../../.env', '/images/%2e%2e/secret.png', '//attacker.example/image.png', 'data:image/png;base64,' + 'A'.repeat(MAX_DATA_IMAGE_LENGTH)]) {
    assert.equal(safeImageSource(source), undefined);
  }
  assert.equal(safeImageSource(image), image);
  assert.equal(safeImageSource('/images/historical-park.webp'), '/images/historical-park.webp');
  assert.equal(safeImageSource('https://example.com/photo.jpg'), 'https://example.com/photo.jpg');
});
test('file signatures are checked independently of a file extension or supplied MIME type', () => {
  assert.equal(matchesImageSignature('image/png', Uint8Array.from([137, 80, 78, 71, 13, 10, 26, 10])), true);
  assert.equal(matchesImageSignature('image/jpeg', Uint8Array.from([255, 216, 255, 224])), true);
  assert.equal(matchesImageSignature('image/gif', new TextEncoder().encode('GIF89a')), true);
  assert.equal(matchesImageSignature('image/webp', new TextEncoder().encode('RIFF0000WEBP')), true);
  assert.equal(matchesImageSignature('image/png', new TextEncoder().encode('<script>alert(1)</script>')), false);
});
test('storage validation rejects corrupt optional fields, unsafe numbers, duplicate IDs and invalid Unicode', () => {
  for (const changes of [{ nameTh: {} }, { mapsQuery: ['not a string'] }, { sourceUrl: 'javascript:alert(1)' }, { id: 1.5 }, { entrance_fee: NaN }, { entrance_fee: -1 }, { rating: Infinity }, { name: '\ud800' }, { name: '' }, { category: '<script>' }, { name: 'a'.repeat(201) }]) {
    assert.equal(normalizeAttraction({ ...mockAttractions[0], ...changes }), null);
  }
  assert.equal(normalizeCatalogue([mockAttractions[0], mockAttractions[0]]), null);
  assert.equal(normalizeCatalogue(Array.from({ length: MAX_ATTRACTIONS + 1 }, (_, i) => ({ ...mockAttractions[0], id: i + 1 }))), null);
  assert.equal(parseStoredCatalogue(' '.repeat(MAX_CATALOGUE_LENGTH + 1)), null);
  assert.equal(parseStoredCatalogue('{broken'), null);
  assert.deepEqual(parseStoredCatalogue('[]'), []);
  assert.equal(normalizeCatalogue(mockAttractions)?.length, 5);
});
test('unknown stored keys cannot become properties of the application catalogue', () => {
  const raw = JSON.parse(JSON.stringify(mockAttractions[0]).replace(/}$/, ',"__proto__":{"polluted":true},"unknown":"value"}'));
  const cleaned = normalizeAttraction(raw)!;
  assert.ok(cleaned);
  assert.equal(Object.hasOwn(cleaned, '__proto__'), false);
  assert.equal(Object.hasOwn(cleaned, 'unknown'), false);
  assert.equal(({} as Record<string, unknown>).polluted, undefined);
});
test('a failed image can recover when its source changes, and unsafe sources use the placeholder', () => {
  let renderer: ReturnType<typeof create>;
  act(() => { renderer = create(<ImageWithFallback src="https://example.com/old.png" alt="Attraction" />); });
  act(() => renderer!.root.findByType('img').props.onError({}));
  assert.match(renderer!.root.findByType('img').props.alt, /unavailable/);
  act(() => renderer!.update(<ImageWithFallback src="/images/historical-park.webp" alt="Attraction" />));
  assert.equal(renderer!.root.findByType('img').props.src, '/images/historical-park.webp');
  act(() => renderer!.update(<ImageWithFallback src="javascript:alert(1)" alt="Attraction" />));
  assert.notEqual(renderer!.root.findByType('img').props.src, 'javascript:alert(1)');
  act(() => renderer!.unmount());
});
test('production policy restricts executable content and the preview sends defensive headers', () => {
  assert.match(productionContentSecurityPolicy, /script-src 'self';/);
  assert.doesNotMatch(productionContentSecurityPolicy, /script-src[^;]*(unsafe-inline|unsafe-eval)/);
  assert.match(productionContentSecurityPolicy, /object-src 'none'/);
  assert.match(productionContentSecurityPolicy, /frame-src https:\/\/www.google.com/);
  assert.equal(responseSecurityHeaders['X-Content-Type-Options'], 'nosniff');
});
