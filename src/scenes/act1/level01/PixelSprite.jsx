import { PAL } from "./sprites";

const cache = new WeakMap();

function toRects(rows) {
    if (cache.has(rows)) return cache.get(rows);

    const out = [];
    rows.forEach((row, y) => {
        let x = 0;
        while (x < row.length) {
            const ch = row[x];

            if (ch === ".") {
                x += 1;
                continue;
            }

            let end = x;
            while (end < row.length && row[end] === ch) end += 1;

            out.push({ x, y, w: end - x, fill: PAL[ch] });
            x = end;
        }
    });

    cache.set(rows, out);
    return out;
}

export default function PixelSprite({ rows, x = 0, y = 0 }) {
    return (
        <g transform={`translate(${x} ${y})`}>
            {toRects(rows).map((r, i) => (
                <rect
                    key={i}
                    x={r.x}
                    y={r.y}
                    width={r.w}
                    height={1}
                    fill={r.fill}
                />
            ))}
        </g>
    );
}
