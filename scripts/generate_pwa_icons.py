"""Generate high-resolution, production-grade PWA icons for InnerOS.

Brand Aesthetic:
- Canvas: Deep soothing teal/botanical gradient (#0F766E to #0D9488 to #115E59)
- Inner Motif: Radiant concentric clarity rings and mindful leaf/sanctuary lotus
- High-contrast, WCAG 2.2 compliant, anti-aliased with safe-zone margins for maskable icons
"""

import os
import math
from PIL import Image, ImageDraw

OUTPUT_DIR = os.path.abspath("apps/web/public/icons")
os.makedirs(OUTPUT_DIR, exist_ok=True)

def create_inneros_icon(size: int, is_maskable: bool = False, is_apple: bool = False) -> Image.Image:
    # 4x super-sampling for ultra crisp edges
    scale = 4
    canvas_size = size * scale
    img = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    center = canvas_size / 2.0

    # For maskable icons, keep content within 80% safe zone
    # For standard icons, use rounded squircle or circle
    if is_maskable:
        # Full bleed background with gradient
        for y in range(canvas_size):
            t = y / canvas_size
            r = int(15 * (1 - t) + 13 * t)
            g = int(118 * (1 - t) + 148 * t)
            b = int(110 * (1 - t) + 136 * t)
            draw.line([(0, y), (canvas_size, y)], fill=(r, g, b, 255))
        content_radius = canvas_size * 0.36
    elif is_apple:
        # Apple touch icon: square full bleed (iOS handles the squircle clip)
        for y in range(canvas_size):
            t = y / canvas_size
            r = int(13 * (1 - t) + 15 * t)
            g = int(148 * (1 - t) + 118 * t)
            b = int(136 * (1 - t) + 110 * t)
            draw.line([(0, y), (canvas_size, y)], fill=(r, g, b, 255))
        content_radius = canvas_size * 0.38
    else:
        # Standard icon with rounded background
        corner_r = canvas_size * 0.22
        # Draw rounded rectangle background
        bg_img = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
        bg_draw = ImageDraw.Draw(bg_img)
        for y in range(canvas_size):
            t = y / canvas_size
            r = int(15 * (1 - t) + 13 * t)
            g = int(118 * (1 - t) + 148 * t)
            b = int(110 * (1 - t) + 136 * t)
            bg_draw.line([(0, y), (canvas_size, y)], fill=(r, g, b, 255))
        
        mask = Image.new("L", (canvas_size, canvas_size), 0)
        mask_draw = ImageDraw.Draw(mask)
        mask_draw.rounded_rectangle([(0, 0), (canvas_size, canvas_size)], radius=int(corner_r), fill=255)
        img.paste(bg_img, (0, 0), mask)
        content_radius = canvas_size * 0.38

    # Concentric clarity circles (translucent white)
    num_rings = 3
    for i in range(num_rings, 0, -1):
        ring_r = content_radius * (i / num_rings) * 0.95
        alpha = int(35 + (3 - i) * 20)
        draw.ellipse(
            [center - ring_r, center - ring_r, center + ring_r, center + ring_r],
            outline=(255, 255, 255, alpha),
            width=int(scale * 2.5),
        )

    # Radiant sanctuary center glowing sphere
    core_r = content_radius * 0.42
    draw.ellipse(
        [center - core_r, center - core_r, center + core_r, center + core_r],
        fill=(255, 255, 255, 60),
    )

    # Mindful Sanctuary Lotus / Leaf Motif in bright white
    leaf_scale = content_radius * 0.55
    # Central mindful flame/leaf
    points_center = []
    steps = 40
    for s in range(steps + 1):
        theta = math.pi * s / steps
        # Leaf curve
        w = math.sin(theta) * (leaf_scale * 0.48)
        y = center + (math.cos(theta) * leaf_scale * 0.7)
        points_center.append((center + w, y))
    for s in range(steps, -1, -1):
        theta = math.pi * s / steps
        w = math.sin(theta) * (leaf_scale * 0.48)
        y = center + (math.cos(theta) * leaf_scale * 0.7)
        points_center.append((center - w, y))

    draw.polygon(points_center, fill=(255, 255, 255, 240))

    # Left & right petals
    for direction in (-1, 1):
        petals = []
        for s in range(steps + 1):
            theta = math.pi * s / steps
            x_offset = math.sin(theta) * (leaf_scale * 0.35)
            y_offset = (math.cos(theta) * leaf_scale * 0.55)
            # rotate 30 degrees
            angle = direction * math.radians(28)
            rx = x_offset * math.cos(angle) - y_offset * math.sin(angle)
            ry = x_offset * math.sin(angle) + y_offset * math.cos(angle)
            petals.append((center + rx + (direction * leaf_scale * 0.28), center + ry + (leaf_scale * 0.12)))
        draw.polygon(petals, fill=(255, 255, 255, 195))

    # Downsample with Lanczos filter for crisp anti-aliasing
    final_img = img.resize((size, size), Image.Resampling.LANCZOS)
    return final_img

def generate_svg_icon():
    svg_content = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="innerosGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F766E"/>
      <stop offset="50%" stop-color="#0D9488"/>
      <stop offset="100%" stop-color="#115E59"/>
    </linearGradient>
    <radialGradient id="innerosGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="512" height="512" rx="112" fill="url(#innerosGrad)"/>
  <circle cx="256" cy="256" r="180" fill="none" stroke="#FFFFFF" stroke-opacity="0.2" stroke-width="6"/>
  <circle cx="256" cy="256" r="125" fill="none" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="5"/>
  <circle cx="256" cy="256" r="75" fill="url(#innerosGlow)"/>
  <path d="M256 120 C290 190 290 290 256 360 C222 290 222 190 256 120 Z" fill="#FFFFFF" fill-opacity="0.95"/>
  <path d="M256 220 C320 220 350 280 320 330 C280 320 260 270 256 220 Z" fill="#FFFFFF" fill-opacity="0.8"/>
  <path d="M256 220 C192 220 162 280 192 330 C232 320 252 270 256 220 Z" fill="#FFFFFF" fill-opacity="0.8"/>
</svg>'''
    with open(os.path.join(OUTPUT_DIR, "icon.svg"), "w") as f:
        f.write(svg_content)
    with open(os.path.join("apps/web/public", "favicon.svg"), "w") as f:
        f.write(svg_content)

def main():
    icons_to_make = [
        ("icon-192x192.png", 192, False, False),
        ("icon-512x512.png", 512, False, False),
        ("icon-maskable-192x192.png", 192, True, False),
        ("icon-maskable-512x512.png", 512, True, False),
        ("apple-touch-icon.png", 180, False, True),
    ]

    for fname, size, is_maskable, is_apple in icons_to_make:
        out_path = os.path.join(OUTPUT_DIR, fname)
        img = create_inneros_icon(size, is_maskable=is_maskable, is_apple=is_apple)
        img.save(out_path, "PNG", optimize=True)
        print(f"Generated {out_path} ({size}x{size})")

    # Also copy apple-touch-icon to public root for iOS fallback
    root_apple = os.path.join("apps/web/public", "apple-touch-icon.png")
    img_apple = create_inneros_icon(180, is_apple=True)
    img_apple.save(root_apple, "PNG", optimize=True)
    print(f"Generated {root_apple} (180x180)")

    # Generate 32x32 favicon
    favicon_path = os.path.join("apps/web/public", "favicon.ico")
    img_fav = create_inneros_icon(32)
    img_fav.save(favicon_path, "ICO")
    print(f"Generated {favicon_path} (32x32)")

    generate_svg_icon()
    print("Generated SVG icons")

if __name__ == "__main__":
    main()
