#!/usr/bin/env python3
import math
import os

import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as ndi

OUT = os.path.normpath(os.path.join(os.path.dirname(__file__), '..', '..', 'public', 'decay'))
SIZE = 800
SS = 2
LIGHT = np.array([-0.62, -0.78])

WEBS = {
    'tl': dict(seed=11, origin=(9.0, 10.0)),
    'tr': dict(seed=37, origin=(91.0, 11.0)),
    'bl': dict(seed=41, origin=(10.0, 90.0)),
    'br': dict(seed=23, origin=(90.0, 91.0)),
}


def walk(rng, x, y, heading, length, step=(5.0, 12.0)):
    pts = [(x, y, heading)]
    h, travelled = heading, 0.0

    while travelled < length:
        s = rng.uniform(*step)
        h += (rng.random() - 0.5) * 0.3
        if rng.random() < 0.18:
            h += rng.choice([-1, 1]) * rng.uniform(0.25, 0.6)

        x += math.cos(h) * s
        y += math.sin(h) * s
        travelled += s
        pts.append((x, y, h))

    return pts


def grow(rng, segs, pts, w0, tier, max_tier):
    for i in range(1, len(pts)):
        segs.append((pts[i - 1], pts[i], w0 * (1 - 0.75 * i / len(pts)), tier))

    if tier >= max_tier:
        return

    for i in range(2, len(pts) - 1):
        if rng.random() < (0.34 if tier == 0 else 0.2):
            side = rng.choice([-1, 1])
            heading = pts[i][2] + side * rng.uniform(0.4, 1.0)
            length = (len(pts) - i) * 7 * rng.uniform(0.35, 0.8)
            grow(rng, segs, walk(rng, pts[i][0], pts[i][1], heading, length), w0 * 0.62, tier + 1, max_tier)


def at_radius(pts, ox, oy, radius):
    for i in range(1, len(pts)):
        d0 = math.hypot(pts[i - 1][0] - ox, pts[i - 1][1] - oy)
        d1 = math.hypot(pts[i][0] - ox, pts[i][1] - oy)

        if d1 >= radius:
            k = 0 if d1 == d0 else (radius - d0) / (d1 - d0)
            return (pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * k, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * k)

    return None


def build_web(seed, origin):
    rng = np.random.default_rng(seed)
    ox, oy = origin
    inward = math.atan2(50 - oy, 50 - ox)
    segs, rays = [], []
    count = 12

    for i in range(count):
        heading = inward + ((i / count) * math.tau - math.pi) * 0.72 + (rng.random() - 0.5) * 0.3
        facing = math.cos(heading - inward) > 0
        length = 105 * (0.45 + 0.55 * rng.random()) * (1.0 if facing else 0.5)
        pts = walk(rng, ox, oy, heading, length)
        rays.append(pts)
        grow(rng, segs, pts, 3.4, 0, 3)

    for radius in (9, 18, 30, 45, 62):
        for i in range(len(rays) - 1):
            p1, p2 = at_radius(rays[i], ox, oy, radius), at_radius(rays[i + 1], ox, oy, radius)
            if not p1 or not p2 or rng.random() < 0.28:
                continue

            mid = ((p1[0] + p2[0]) / 2 + rng.normal(0, 1.6), (p1[1] + p2[1]) / 2 + rng.normal(0, 1.6))
            segs.append(((*p1, 0), (*mid, 0), 1.7, 2))
            segs.append(((*mid, 0), (*p2, 0), 1.7, 2))

    for _ in range(26):
        h = rng.uniform(0, math.tau)
        d0, d1 = rng.uniform(0.4, 1.6), rng.uniform(1.8, 5.0)
        segs.append(((ox + math.cos(h) * d0, oy + math.sin(h) * d0, h), (ox + math.cos(h) * d1, oy + math.sin(h) * d1, h), 2.2, 0))

    facets = []
    for i in range(len(rays) - 1):
        p1, p2 = at_radius(rays[i], ox, oy, 26), at_radius(rays[i + 1], ox, oy, 26)
        if p1 and p2 and rng.random() < 0.5:
            facets.append(([(ox, oy), p1, p2], 'light' if rng.random() < 0.5 else 'dark'))

    return segs, facets


def px(v):
    return v / 100 * SIZE * SS


def rasterise(segs):
    im = Image.new('L', (SIZE * SS, SIZE * SS), 0)
    d = ImageDraw.Draw(im)

    for a, b, w, _tier in segs:
        width = max(1, round(w * SS))
        d.line([(px(a[0]), px(a[1])), (px(b[0]), px(b[1]))], fill=255, width=width)
        r = width / 2

        for p in (a, b):
            d.ellipse([px(p[0]) - r, px(p[1]) - r, px(p[0]) + r, px(p[1]) + r], fill=255)

    return np.asarray(im.resize((SIZE, SIZE), Image.LANCZOS), dtype=np.float64) / 255


def layer(rgb, alpha):
    a = np.clip(alpha, 0, 1)
    out = np.zeros((SIZE, SIZE, 4), dtype=np.uint8)
    out[..., 0], out[..., 1], out[..., 2] = rgb
    out[..., 3] = (a * 255).astype(np.uint8)

    return Image.fromarray(out, 'RGBA')


def render(name, seed, origin):
    segs, facets = build_web(seed, origin)
    M = rasterise(segs)

    Mb = ndi.gaussian_filter(M, 1.5)
    gy, gx = np.gradient(Mb)
    lit = gx * LIGHT[0] + gy * LIGHT[1]
    hi = np.clip(lit, 0, None)
    lo = np.clip(-lit, 0, None)
    hi /= np.percentile(hi[hi > 0], 99) if (hi > 0).any() else 1
    lo /= np.percentile(lo[lo > 0], 99) if (lo > 0).any() else 1

    frost = ndi.gaussian_filter(M, 3.4)
    shadow = ndi.gaussian_filter(ndi.shift(M, (5, 3)), 3.2)
    leak = ndi.gaussian_filter(M, 7.0)

    fac = Image.new('L', (SIZE * SS, SIZE * SS), 0)
    fdark = Image.new('L', (SIZE * SS, SIZE * SS), 0)
    fd, dd = ImageDraw.Draw(fac), ImageDraw.Draw(fdark)

    for pts, tone in facets:
        poly = [(px(x), px(y)) for x, y in pts]
        (fd if tone == 'light' else dd).polygon(poly, fill=255)

    f_light = np.asarray(fac.resize((SIZE, SIZE), Image.LANCZOS), dtype=np.float64) / 255
    f_dark = np.asarray(fdark.resize((SIZE, SIZE), Image.LANCZOS), dtype=np.float64) / 255

    yy, xx = np.mgrid[0:SIZE, 0:SIZE]
    cx, cy = origin[0] / 100 * SIZE, origin[1] / 100 * SIZE
    bloom = np.exp(-(((xx - cx) ** 2 + (yy - cy) ** 2) / (2 * 11.0 ** 2)))

    img = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    for lyr in (
        layer((238, 86, 109), np.clip(leak * 2.4, 0, 1) * 0.40),
        layer((0, 0, 0), np.clip(shadow * 1.9, 0, 1) * 0.70),
        layer((255, 244, 244), np.clip(frost * 1.9, 0, 1) * 0.22),
        layer((255, 255, 255), f_light * 0.07),
        layer((0, 0, 0), f_dark * 0.26),
        layer((255, 255, 255), bloom * 0.30),
        layer((6, 4, 4), np.clip(M * 1.25, 0, 1) * 0.96),
        layer((255, 240, 240), hi * (1 - M * 0.6) * 0.80),
        layer((0, 0, 0), lo * 0.55),
    ):
        img = Image.alpha_composite(img, lyr)

    os.makedirs(OUT, exist_ok=True)
    path = os.path.join(OUT, f'crack-{name}.webp')
    img.save(path, 'WEBP', quality=88, method=6)

    return path


if __name__ == '__main__':
    for name, cfg in WEBS.items():
        print(render(name, **cfg), os.path.getsize(os.path.join(OUT, f'crack-{name}.webp')) // 1024, 'KB')
