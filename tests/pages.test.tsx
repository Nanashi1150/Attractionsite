import test, { beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { create, act, type ReactTestRenderer } from 'react-test-renderer';
import { renderToStaticMarkup } from 'react-dom/server';
import { AppProvider, useApp } from '../src/app/contexts/AppContext';
import { LanguageProvider } from '../src/app/contexts/LanguageContext';
import { Header } from '../src/app/components/Header';
import { AttractionsPage } from '../src/app/components/pages/AttractionsPage';
import { DetailPage } from '../src/app/components/pages/DetailPage';
import { AboutPage } from '../src/app/components/pages/AboutPage';
import { FormPage } from '../src/app/components/pages/FormPage';
import { IndexPage } from '../src/app/components/pages/IndexPage';
import { mockAttractions, googleMapsUrl, googleDirectionsUrl, mapQuery } from '../src/app/types/TouristAttraction';
import { photoCredits, attractionPhoto } from '../src/app/data/photoCredits';

const noNavigation = () => {};
const wrap = (children: React.ReactNode) => <LanguageProvider><AppProvider>{children}</AppProvider></LanguageProvider>;

test('public navigation and catalogue contain no management actions', () => {
  const html = renderToStaticMarkup(wrap(<><Header currentPage="index" onNavigate={noNavigation} /><AttractionsPage management onNavigate={noNavigation} /><DetailPage attractionId={1} onNavigate={noNavigation} /></>));
  assert.doesNotMatch(html, />Manage Attractions</);
  assert.doesNotMatch(html, />Edit</);
  assert.doesNotMatch(html, />Delete</);
  assert.doesNotMatch(html, /Add New Attraction/);
  assert.match(html, /Places worth the journey/);
  assert.match(html, /google\.com\/maps/);
});

test('form cannot render in public mode', () => {
  assert.equal(renderToStaticMarkup(wrap(<FormPage mode="add" onNavigate={noNavigation} />)), '');
});

test('each destination has a distinct Maps query, local authentic photograph and source', () => {
  assert.equal(new Set(mockAttractions.map(mapQuery)).size, 5);
  for (const a of mockAttractions) {
    assert.ok(a.nameTh && a.descriptionTh && a.addressTh && a.sourceUrl);
    assert.ok(a.image && existsSync('public' + a.image));
    assert.ok(photoCredits.some(p => p.image === a.image));
    const url = new URL(googleMapsUrl(a));
    assert.equal(url.origin, 'https://www.google.com');
    assert.equal(url.searchParams.get('query'), mapQuery(a));
    assert.equal(new URL(googleDirectionsUrl(a)).searchParams.get('destination'), mapQuery(a));
    const detail = renderToStaticMarkup(wrap(<DetailPage attractionId={a.id} onNavigate={noNavigation} />));
    assert.match(detail, /<iframe/);
    assert.ok(detail.includes(encodeURIComponent(mapQuery(a)).replaceAll('&', '&amp;')));
  }
});

test('About renders a five-step roadmap and home omits the removed hero badge', () => {
  const about = renderToStaticMarkup(wrap(<AboutPage />));
  assert.match(about, /Historical roadmap/);
  assert.equal((about.match(/roadmap-step /g) || []).length, 5);
  assert.doesNotMatch(about, /A brief history/);
  const home = renderToStaticMarkup(wrap(<IndexPage onNavigate={noNavigation} />));
  assert.doesNotMatch(home, />UNESCO World Heritage</);
  assert.doesNotMatch(home, /images\.unsplash\.com/);
});
test('saved text is escaped rather than interpreted as HTML', () => {
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  const saved = JSON.stringify([{ ...mockAttractions[0], name: '<img src=x onerror=alert(1)>' }]);
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: { getItem: (key: string) => key === 'kamphaeng-phet.attractions.v2' ? saved : null } });
  try {
    const html = renderToStaticMarkup(wrap(<DetailPage attractionId={1} onNavigate={noNavigation} />));
    assert.match(html, /&lt;img src=x onerror=alert\(1\)&gt;/);
    assert.doesNotMatch(html, /<img src=x onerror/);
  } finally {
    if (previous) Object.defineProperty(globalThis, 'localStorage', previous);
    else Reflect.deleteProperty(globalThis, 'localStorage');
  }
});
test('every default photo position across the public site uses a distinct licensed image', () => {
  const html = [
    renderToStaticMarkup(wrap(<IndexPage onNavigate={noNavigation} />)),
    renderToStaticMarkup(wrap(<AboutPage />)),
    renderToStaticMarkup(wrap(<AttractionsPage onNavigate={noNavigation} />)),
    ...mockAttractions.map(a => renderToStaticMarkup(wrap(<DetailPage attractionId={a.id} onNavigate={noNavigation} />))),
  ].join('');
  const displayed = [...html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)].map(match => match[1]);
  assert.equal(displayed.length, 20);
  assert.equal(new Set(displayed).size, displayed.length);
  assert.equal(new Set(photoCredits.map(p => p.source)).size, 20);
  const hashes = displayed.map(image => {
    assert.ok(photoCredits.some(p => p.image === image && p.author && p.licenseUrl));
    return createHash('sha256').update(readFileSync('public' + image)).digest('hex');
  });
  assert.equal(new Set(hashes).size, displayed.length);
});
test('custom catalogue images remain under the editor control', () => {
  const custom = { ...mockAttractions[0], image: 'https://example.com/custom.png' };
  assert.equal(attractionPhoto(custom, 'detail'), custom.image);
  assert.equal(attractionPhoto(custom, 'featured'), custom.image);
});
