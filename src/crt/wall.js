function rng(seed) {
    let a = seed >>> 0;

    return () => {
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;

        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function crack(r, x, y, angle, length, depth, out) {
    const pts = [[x, y]];

    let cx = x,
        cy = y,
        a = angle,
        left = length;

    while (left > 0) {
        const step = 12 + r() * 26;
        a += (r() - 0.5) * 0.95;
        cx += Math.cos(a) * step;
        cy += Math.sin(a) * step;
        pts.push([cx, cy]);
        left -= step;

        if (depth < 2 && r() < 0.15)
            crack(
                r,
                cx,
                cy,
                a + (r() < 0.5 ? -1 : 1) * (0.5 + r() * 0.8),
                left * (0.3 + r() * 0.35),
                depth + 1,
                out,
            );
    }

    out.push(pts);
}

const toPath = (pts) =>
    `M${pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L")}`;

export function wallCracks() {
    const r = rng(7);
    const out = [];

    crack(r, 190, -10, 1.45, 560, 0, out);
    crack(r, 1410, -10, 1.72, 460, 0, out);
    crack(r, -10, 430, 0.12, 380, 0, out);
    crack(r, 1610, 690, 3.0, 400, 0, out);
    crack(r, 330, 1010, -1.5, 280, 0, out);
    crack(r, 1250, 1010, -1.35, 320, 0, out);

    return out.map(toPath);
}

export function wallScuffs() {
    const r = rng(21);
    const out = [];

    for (let i = 0; i < 18; i++) {
        const x = r() * 1600,
            y = 40 + r() * 860;
        const a = (r() < 0.5 ? 0.2 : 1.35) + (r() - 0.5) * 0.7;
        const len = 14 + r() * 40;

        out.push(
            `M${x.toFixed(1)} ${y.toFixed(1)} l${(Math.cos(a) * len).toFixed(1)} ${(Math.sin(a) * len).toFixed(1)}`,
        );
    }

    return out;
}
