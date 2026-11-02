import PixelSprite from "./PixelSprite";
import { SPRITES } from "./sprites";
import { BUGS, SCENE_W, SCENE_H } from "./bugs";
import s from "./level01.module.css";

export default function PixelScene({ found, pings, cursor }) {
    return (
        <svg
            className={s.svg}
            viewBox={`0 0 ${SCENE_W} ${SCENE_H}`}
            shapeRendering="crispEdges"
            role="img"
            aria-label="A small pixel-art game screen with a house, a tree, a hero and an inventory bar"
        >
            <rect width={SCENE_W} height={SCENE_H} fill="#0f1522" />
            {[
                [40, 30],
                [90, 44],
                [170, 26],
                [230, 36],
                [300, 60],
                [20, 70],
                [140, 62],
            ].map(([x, y]) => (
                <rect
                    key={`${x}${y}`}
                    x={x}
                    y={y}
                    width="1"
                    height="1"
                    fill="#aab0bb"
                    opacity="0.6"
                />
            ))}
            <rect
                x="284"
                y="26"
                width="10"
                height="10"
                fill="#d9dde6"
                opacity="0.9"
            />
            <g className={s.cloud}>
                <rect x="128" y="32" width="28" height="5" fill="#1b2540" />
                <rect x="134" y="28" width="14" height="4" fill="#1b2540" />
            </g>
            <polygon
                fill="#131c2c"
                points="0,138 0,118 40,108 90,122 150,106 210,120 270,104 320,116 320,138"
            />

            <rect y="138" width={SCENE_W} height="22" fill="#1d2a22" />
            <rect y="138" width={SCENE_W} height="3" fill="#3d6b4f" />
            {[
                [20, 148],
                [66, 152],
                [120, 146],
                [178, 153],
                [236, 149],
                [290, 152],
            ].map(([x, y]) => (
                <rect
                    key={`${x}${y}`}
                    x={x}
                    y={y}
                    width="3"
                    height="1"
                    fill="#2a3b30"
                />
            ))}

            <rect x="28" y="104" width="44" height="34" fill="#4b3b2e" />
            <polygon fill="#900020" points="24,104 50,86 76,104" />
            <rect x="46" y="118" width="10" height="20" fill="#241a14" />
            <rect x="33" y="112" width="8" height="8" fill="#e3c15a" />
            <rect x="62" y="112" width="6" height="8" fill="#e3c15a" />

            <rect x="252" y="112" width="6" height="26" fill="#6b4a2f" />
            <rect x="242" y="92" width="26" height="24" fill="#2c5a43" />
            <rect x="247" y="86" width="16" height="8" fill="#2c5a43" />

            <rect
                x="97"
                y="139"
                width="10"
                height="2"
                fill="#000"
                opacity="0.4"
            />
            <g className={s.bob}>
                <PixelSprite rows={SPRITES.chest} x={96} y={118} />
            </g>
            <PixelSprite rows={SPRITES.barrel} x={190} y={128} />
            <g className={s.idle}>
                <PixelSprite rows={SPRITES.hero} x={150} y={126} />
            </g>

            <text className={s.debug} x="214" y="50">
                DEBUG MODE ON
            </text>

            <rect width={SCENE_W} height="18" fill="#0b0e15" />
            <rect y="18" width={SCENE_W} height="1" fill="#273044" />
            <PixelSprite rows={SPRITES.heart} x={6} y={5} />
            <text className={s.hud} x="9" y="12">
                LIVES x3
            </text>
            <PixelSprite rows={SPRITES.coin} x={70} y={6} />
            <text className={s.hud} x="80" y="12">
                x07
            </text>
            <text className={s.hud} x="120" y="12">
                WORLD 1-1
            </text>
            <text className={s.hud} x="246" y="12">
                TIME 2B4
            </text>

            <rect y="160" width={SCENE_W} height="20" fill="#0b0e15" />
            <rect y="160" width={SCENE_W} height="1" fill="#273044" />
            {[8, 32, 56, 80].map((x) => (
                <rect
                    key={x}
                    x={x}
                    y="162"
                    width="18"
                    height="16"
                    fill="#161c29"
                    stroke="#273044"
                    strokeWidth="1"
                />
            ))}
            <PixelSprite rows={SPRITES.sword} x={13} y={165} />
            <PixelSprite rows={SPRITES.potion} x={37} y={165} />
            <PixelSprite rows={SPRITES.key} x={60} y={168} />
            <PixelSprite rows={SPRITES.cat} x={84} y={166} />

            {BUGS.filter((b) => found.includes(b.id)).map((b) => (
                <g key={b.id} className={s.mark}>
                    <rect
                        x={b.rect.x}
                        y={b.rect.y}
                        width={b.rect.w}
                        height={b.rect.h}
                        fill="none"
                        stroke="#ee566d"
                        strokeWidth="1"
                        strokeDasharray="3 2"
                    />
                    <rect
                        x={b.rect.x}
                        y={b.rect.y - 7}
                        width="11"
                        height="7"
                        fill="#900020"
                    />
                    <text className={s.tag} x={b.rect.x + 2} y={b.rect.y - 1.5}>
                        #{b.number}
                    </text>
                </g>
            ))}

            {pings.map((p) => (
                <circle key={p.id} className={s.ping} cx={p.x} cy={p.y} r="3" />
            ))}

            {cursor && (
                <g className={s.cross} pointerEvents="none">
                    <rect x={cursor.x - 8} y={cursor.y} width="5" height="1" />
                    <rect x={cursor.x + 3} y={cursor.y} width="5" height="1" />
                    <rect x={cursor.x} y={cursor.y - 8} width="1" height="5" />
                    <rect x={cursor.x} y={cursor.y + 3} width="1" height="5" />
                </g>
            )}
        </svg>
    );
}
