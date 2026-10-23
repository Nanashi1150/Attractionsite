import test, { beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { create, act, type ReactTestRenderer } from 'react-test-renderer';
import { AppProvider, useApp } from '../src/app/contexts/AppContext';
import { LanguageProvider } from '../src/app/contexts/LanguageContext';
import { Header } from '../src/app/components/Header';
import { AttractionsPage } from '../src/app/components/pages/AttractionsPage';
import { DetailPage } from '../src/app/components/pages/DetailPage';
import { AboutPage } from '../src/app/components/pages/AboutPage';
import { FormPage } from '../src/app/components/pages/FormPage';
import { IndexPage } from '../src/app/components/pages/IndexPage';
import { mockAttractions, googleMapsUrl, googleDirectionsUrl, mapQuery } from '../src/app/types/TouristAttraction';
import { photoCredits } from '../src/app/data/photoCredits';

let app: ReturnType<typeof useApp>;
let renderer: ReactTestRenderer | undefined;
let clickListener: ((event: unknown) => void) | undefined;
let store: Map<string, string>;
let failStorage = false;
function Probe() { app = useApp(); return null; }
const noNavigation = () => {};
const wrap = (children: React.ReactNode) => <LanguageProvider><AppProvider>{children}</AppProvider></LanguageProvider>;
function mount() { act(() => { renderer = create(wrap(<Probe />)); }); }
function clicks(count: number, trusted = true) { act(() => { for (let i = 0; i < count; i++) clickListener?.({ isTrusted: trusted, button: 0 }); }); }

beforeEach(() => {
  store = new Map(); failStorage = false; clickListener = undefined;
  globalThis.localStorage = {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => { if (failStorage) throw new DOMException('Full', 'QuotaExceededError'); store.set(key, value); },
    removeItem: (key: string) => store.delete(key),
  } as Storage;
  globalThis.document = {
    documentElement: { classList: { toggle() {}, add() {} } },
    addEventListener: (name: string, listener: (event: unknown) => void) => { if (name === 'click') clickListener = listener; },
    removeEventListener: (name: string, listener: (event: unknown) => void) => { if (name === 'click' && clickListener === listener) clickListener = undefined; },
  } as unknown as Document;
  globalThis.window = { scrollY: 0, addEventListener() {}, removeEventListener() {}, scrollTo() {} } as unknown as Window & typeof globalThis;
});
afterEach(() => { if (renderer) act(() => renderer?.unmount()); renderer = undefined; });



test('nine clicks do not enter admin; the tenth trusted click does', () => {
  mount(); clicks(9); assert.equal(app.isAdmin, false);
  clicks(1); assert.equal(app.isAdmin, true);
  act(() => { renderer!.update(wrap(<><Probe /><Header currentPage="manage" onNavigate={noNavigation} /><AttractionsPage management onNavigate={noNavigation} /></>)); });
  assert.match(JSON.stringify(renderer!.toJSON()), /Manage Attractions/);
  assert.match(JSON.stringify(renderer!.toJSON()), /Add New Attraction/);
});
test('script-generated clicks do not unlock the interface', () => {
  mount(); clicks(10, false); assert.equal(app.isAdmin, false);
});
test('a pause breaks the click sequence', async () => {
  mount(); clicks(9);
  await new Promise(resolve => setTimeout(resolve, 1050));
  clicks(1); assert.equal(app.isAdmin, false);
});
test('public mutations are blocked and admin changes survive reload without retaining admin mode', () => {
  mount();
  assert.throws(() => app.deleteAttraction(1), /Administrator/);
  clicks(10);
  act(() => app.updateAttraction(1, { ...app.attractions[0], name: 'Updated historical park' }));
  act(() => app.addAttraction({ name: 'Test destination', place_description: 'A visitor destination used to verify local persistence.', entrance_fee: 0, open_hours: 'Daylight', mapsQuery: 'Kamphaeng Phet Thailand' }));
  assert.equal(app.attractions.length, 6);
  act(() => app.deleteAttraction(2));
  act(() => renderer!.unmount()); renderer = undefined;
  mount();
  assert.equal(app.isAdmin, false);
  assert.equal(app.attractions.length, 5);
  assert.equal(app.getAttractionById(1)?.name, 'Updated historical park');
  assert.equal(app.getAttractionById(2), undefined);
});
test('exit admin immediately revokes editing and resets the gesture', () => {
  mount(); clicks(10); act(() => app.exitAdmin());
  assert.equal(app.isAdmin, false);
  assert.throws(() => app.deleteAttraction(1), /Administrator/);
  clicks(1); assert.equal(app.isAdmin, false);
});
test('failed storage does not silently change the catalogue', () => {
  mount(); clicks(10); failStorage = true;
  assert.throws(() => app.deleteAttraction(1), /Full/);
  assert.equal(app.attractions.length, mockAttractions.length);
});
test('the administrator form saves edits while preserving translated content and references', () => {
  mount(); clicks(10);
  let destination = '';
  act(() => renderer!.update(wrap(<><Probe /><FormPage mode="edit" attractionId={1} onNavigate={page => { destination = page; }} /></>)));
  act(() => renderer!.root.findByProps({ name: 'name' }).props.onChange({ target: { value: 'Verified historical park' } }));
  act(() => renderer!.root.findByProps({ name: 'mapsQuery' }).props.onChange({ target: { value: 'Kamphaeng Phet Historical Park Nong Pling Thailand' } }));
  act(() => renderer!.root.findByType('form').props.onSubmit({ preventDefault() {} }));
  const saved = app.getAttractionById(1)!;
  assert.equal(saved.name, 'Verified historical park');
  assert.equal(saved.mapsQuery, 'Kamphaeng Phet Historical Park Nong Pling Thailand');
  assert.equal(saved.nameTh, mockAttractions[0].nameTh);
  assert.equal(saved.sourceUrl, mockAttractions[0].sourceUrl);
  assert.equal(destination, 'manage');
});
test('malformed saved data falls back to the verified catalogue', () => {
  store.set('kamphaeng-phet.attractions.v2', '[{"id":"broken"}]'); mount();
  assert.equal(app.attractions.length, 5);
});


