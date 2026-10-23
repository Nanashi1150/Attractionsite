"""Create local WebP derivatives; preserve reference copies and attribution."""
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
output = ROOT / 'public' / 'images'
output.mkdir(parents=True, exist_ok=True)
for original in (ROOT / 'reference' / 'photos').glob('*.jpg'):
    with Image.open(original) as source:
        image = ImageOps.exif_transpose(source).convert('RGB')
        image.thumbnail((1920, 1920))
        destination = output / (original.stem + '.webp')
        image.save(destination, 'WEBP', quality=84)
        print(f'{destination.name}: {destination.stat().st_size} bytes')
