const TAU = Math.PI * 2;
const LIGHT = Math.atan2(-1, -1);

const poly = (n, rx, ry, rot = 0, cx = 32, cy = 32) =>
    Array.from({ length: n }, (_, i) => {
        const a = rot + (i / n) * TAU;

        return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry];
    });

const OUTLINES = {
    round: () => poly(12, 27, 27, -Math.PI / 12),

    emerald: () => [
        [18, 4],
        [46, 4],
        [58, 16],
        [58, 48],
        [46, 60],
        [18, 60],
        [6, 48],
        [6, 16],
    ],

    trillion: () => {
        const v = [
            [32, 4],
            [60, 54],
            [4, 54],
        ];
        const c = [32, 37];
        const out = [];

        v.forEach((a, i) => {
            const b = v[(i + 1) % 3];
            const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
            const d = [m[0] - c[0], m[1] - c[1]];
            const k = 5 / Math.hypot(d[0], d[1]);

            out.push(a, [m[0] + d[0] * k, m[1] + d[1] * k]);
        });

        return out;
    },

    marquise: () => {
        const N = 7;
        const right = Array.from({ length: N + 1 }, (_, u) => [
            32 + 19 * Math.sin((Math.PI * u) / N),
            3 + (58 * u) / N,
        ]);

        const left = Array.from({ length: N - 1 }, (_, k) => {
            const u = N - 1 - k;
            return [32 - 19 * Math.sin((Math.PI * u) / N), 3 + (58 * u) / N];
        });

        return [...right, ...left];
    },

    pear: () =>
        Array.from({ length: 16 }, (_, i) => {
            const t = (i / 16) * TAU;
            const r = 20 + 16 * Math.pow(Math.cos(t / 2), 8);
            return [32 + r * Math.sin(t), 38 - r * Math.cos(t)];
        }),

    heart: () =>
        Array.from({ length: 18 }, (_, i) => {
            const t = (i / 18) * TAU;

            const x = 16 * Math.pow(Math.sin(t), 3);
            const y =
                13 * Math.cos(t) -
                5 * Math.cos(2 * t) -
                2 * Math.cos(3 * t) -
                Math.cos(4 * t);

            return [32 + 1.65 * x, 30 - 1.55 * y];
        }),

    hexagon: () => poly(6, 28, 28, -Math.PI / 2),

    cushion: () =>
        Array.from({ length: 16 }, (_, i) => {
            const t = (i / 16) * TAU + Math.PI / 16;
            const c = Math.cos(t),
                s = Math.sin(t);

            return [
                32 + 26 * Math.sign(c) * Math.pow(Math.abs(c), 0.5),
                32 + 26 * Math.sign(s) * Math.pow(Math.abs(s), 0.5),
            ];
        }),

    kite: () => [
        [32, 3],
        [57, 25],
        [32, 61],
        [7, 25],
    ],

    asscher: () => poly(8, 28, 28, Math.PI / 8),

    oval: () => poly(14, 19, 28, -Math.PI / 2),

    crystal: () => [
        [32, 2],
        [46, 16],
        [46, 58],
        [18, 58],
        [18, 16],
    ],
};

const f1 = (n) => n.toFixed(1);
const pts = (list) => list.map((p) => `${f1(p[0])},${f1(p[1])}`).join(" ");
const cache = new Map();

export function buildGem(shape) {
    if (cache.has(shape)) return cache.get(shape);

    const P = OUTLINES[shape]();
    const n = P.length;
    const c = [
        P.reduce((s, p) => s + p[0], 0) / n,
        P.reduce((s, p) => s + p[1], 0) / n,
    ];

    const scale = (p, k) => [
        c[0] + (p[0] - c[0]) * k,
        c[1] + (p[1] - c[1]) * k,
    ];

    const M = P.map((p) => scale(p, 0.66));
    const T = P.map((p) => scale(p, 0.36));

    const facing = (quad) => {
        const x = quad.reduce((s, p) => s + p[0], 0) / quad.length - c[0];
        const y = quad.reduce((s, p) => s + p[1], 0) / quad.length - c[1];

        return 0.5 + 0.5 * Math.cos(Math.atan2(y, x) - LIGHT); // 0..1
    };

    const facets = [];
    for (let i = 0; i < n; i++) {
        const j = (i + 1) % n;

        const outer = [P[i], P[j], M[j], M[i]];
        const inner = [M[i], M[j], T[j], T[i]];
        const jitter = i % 2 ? 6 : -4;

        facets.push({
            points: pts(outer),
            l: 24 + facing(outer) * 38 + jitter,
        });

        facets.push({
            points: pts(inner),
            l: 36 + facing(inner) * 34 - jitter,
        });
    }

    facets.push({ points: pts(T), l: 66 });

    const spark = T.reduce(
        (best, p) => (p[0] + p[1] < best[0] + best[1] ? p : best),
        T[0],
    );

    const gem = {
        facets,
        path: `M${P.map((p) => `${f1(p[0])} ${f1(p[1])}`).join(" L")} Z`,
        spark: [spark[0], spark[1]],
    };

    cache.set(shape, gem);
    return gem;
}
