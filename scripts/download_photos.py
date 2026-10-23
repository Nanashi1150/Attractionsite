"""Download attributed, place-specific photographs for the local tourism site."""
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.error import HTTPError
import time
import json

ROOT = Path(__file__).resolve().parents[1] / 'reference' / 'photos'
manifest = json.loads((ROOT.parent / 'photo-manifest.json').read_text(encoding='utf8'))
PHOTOS = {Path(photo['image']).stem + '.jpg': photo.get('downloadUrl', photo['url']) for photo in manifest}

def download(item):
    filename, url = item
    if (ROOT / filename).exists():
        print(f'{filename}: already downloaded', flush=True)
        return
    request = Request(url, headers={'User-Agent': 'KamphaengPhetTourismLocal/2.0 (educational local preview)'})
    with urlopen(request, timeout=90) as response:
        if not response.headers.get('Content-Type', '').startswith('image/'):
            raise RuntimeError(f'{filename}: response is not an image')
        content = response.read()
    if len(content) < 1000:
        raise RuntimeError(f'{filename}: incomplete image')
    (ROOT / filename).write_bytes(content)
    print(f'{filename}: {len(content)} bytes', flush=True)

ROOT.mkdir(parents=True, exist_ok=True)
for item in PHOTOS.items():
    if (ROOT / item[0]).exists():
        print(f'{item[0]}: already downloaded', flush=True)
        continue
    for attempt in range(3):
        try:
            download(item)
            break
        except HTTPError as error:
            if error.code != 429 or attempt == 2:
                raise
            delay = int(error.headers.get('Retry-After', '15'))
            print(f'Rate limited; waiting {delay} seconds', flush=True)
            time.sleep(delay)
    time.sleep(2)
