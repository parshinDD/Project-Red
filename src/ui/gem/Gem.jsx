import { useId } from "react";
import { GEMS } from "@/game/data/gems";
import { cx } from "@/lib/cx";
import { buildGem } from "./geometry";
import s from "./gem.module.css";

export default function Gem({
    n,
    size = "4rem",
    empty = false,
    ghost = false,
    glow = true,
    className,
}) {
    const def = GEMS[n];
    const geo = buildGem(def.shape);
    const uid = useId().replace(/:/g, "");

    const { hue: h, sat: sa } = def;
    const box = { width: size, height: size };

    if (empty && ghost) {
        return (
            <span
                className={cx(s.gem, className)}
                style={box}
                aria-hidden="true"
            >
                <svg className={s.svg} viewBox="0 0 64 64">
                    <path d={geo.path} className={s.ghost} />
                </svg>
            </span>
        );
    }

    if (empty) {
        return (
            <span
                className={cx(s.gem, className)}
                style={box}
                aria-hidden="true"
            >
                <svg className={s.svg} viewBox="0 0 64 64">
                    <path
                        d={geo.path}
                        transform="translate(0 1.2)"
                        className={s.socketEdge}
                    />
                    <path d={geo.path} className={s.socketFill} />
                </svg>
            </span>
        );
    }

    return (
        <span className={cx(s.gem, className)} style={box} aria-hidden="true">
            {glow && (
                <i
                    className={s.halo}
                    style={{
                        background: `radial-gradient(circle, hsl(${h} ${sa}% 58% / 0.5), transparent 66%)`,
                    }}
                />
            )}
            <svg
                className={s.svg}
                viewBox="0 0 64 64"
                style={{
                    filter: `drop-shadow(0 0 0.45rem hsl(${h} ${sa}% 55% / 0.75))`,
                }}
            >
                <defs>
                    <clipPath id={`c${uid}`}>
                        <path d={geo.path} />
                    </clipPath>
                    <linearGradient id={`g${uid}`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="#fff" stopOpacity="0.5" />
                        <stop
                            offset="0.45"
                            stopColor="#fff"
                            stopOpacity="0.06"
                        />
                        <stop offset="1" stopColor="#000" stopOpacity="0.25" />
                    </linearGradient>
                </defs>
                {geo.facets.map((f, i) => (
                    <polygon
                        key={i}
                        points={f.points}
                        fill={`hsl(${h} ${sa}% ${f.l.toFixed(0)}%)`}
                        stroke={`hsl(${h} ${sa}% ${Math.min(90, f.l + 12).toFixed(0)}% / 0.55)`}
                        strokeWidth="0.35"
                        strokeLinejoin="round"
                    />
                ))}
                <g clipPath={`url(#c${uid})`}>
                    <rect width="64" height="64" fill={`url(#g${uid})`} />
                </g>
                <path
                    d={geo.path}
                    fill="none"
                    stroke={`hsl(${h} ${Math.max(20, sa - 20)}% 84% / 0.8)`}
                    strokeWidth="0.9"
                    strokeLinejoin="round"
                />
                <g
                    transform={`translate(${geo.spark[0].toFixed(1)} ${geo.spark[1].toFixed(1)})`}
                >
                    <path
                        className={s.twinkle}
                        style={{ "--td": `${(n % 5) * 0.7}s` }}
                        d="M0 -6 L1.3 -1.3 L6 0 L1.3 1.3 L0 6 L-1.3 1.3 L-6 0 L-1.3 -1.3 Z"
                    />
                </g>
            </svg>
        </span>
    );
}
