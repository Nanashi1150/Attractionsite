"""Download attributed, place-specific photographs for the local tourism site."""
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.error import HTTPError
import time

ROOT = Path(__file__).resolve().parents[1] / 'reference' / 'photos'
PHOTOS = {
    'historical-park.jpg': 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Kamphaeng_Phet_Historical_Park.jpg',
    'wat-phra-borommathat.jpg': 'https://upload.wikimedia.org/wikipedia/commons/5/52/Wat_Phra_Borom_That_Kamphaeng_Phet%2C_Thailand._01.jpg',
    'khlong-lan.jpg': 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Khlong_Lan_National_Park.jpg',
    'national-museum.jpg': 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Kamphaeng_Phet_National_Museum.jpg',
    'mae-wong.jpg': 'https://upload.wikimedia.org/wikipedia/commons/a/a6/1054-Mae-Wong-National-park-01.jpg',
}

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
    for attempt in range(3):
        try:
            download(item)
            break
        except HTTPError as error:
            if error.code != 429 or attempt == 2:
                raise
            time.sleep(15)
    time.sleep(2)
