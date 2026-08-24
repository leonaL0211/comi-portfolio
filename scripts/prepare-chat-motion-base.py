from pathlib import Path

from PIL import Image


PROJECT_ROOT = Path(__file__).resolve().parents[1]
IMAGES = PROJECT_ROOT / "public" / "images"


for theme in ("light", "dark"):
    source_path = IMAGES / f"app-chat-{theme}.png"
    output_path = IMAGES / f"app-chat-motion-base-{theme}.png"
    image = Image.open(source_path).convert("RGBA")
    pixels = image.load()

    top_y = 269
    bottom_y = 617
    top_row = [pixels[x, top_y] for x in range(image.width)]
    bottom_row = [pixels[x, bottom_y] for x in range(image.width)]

    for y in range(top_y + 1, bottom_y):
        blend = (y - top_y) / (bottom_y - top_y)
        for x in range(image.width):
            top = top_row[x]
            bottom = bottom_row[x]
            pixels[x, y] = tuple(
                round(top[channel] * (1 - blend) + bottom[channel] * blend)
                for channel in range(4)
            )

    image.save(output_path)
    print(f"Prepared {output_path.name}")
