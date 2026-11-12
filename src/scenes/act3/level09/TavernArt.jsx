import s from "./level09.module.css";

function Eyes({ cx, cy, gap = 12, r = 3.2 }) {
    return (
        <>
            {[-1, 1].map((d) => (
                <g key={d}>
                    <ellipse
                        cx={cx + d * gap}
                        cy={cy}
                        rx={r}
                        ry={r + 0.4}
                        fill="#2a1a10"
                    />
                    <circle
                        cx={cx + d * gap - 1}
                        cy={cy - 1.2}
                        r="1"
                        fill="#fff"
                        opacity="0.85"
                    />
                </g>
            ))}
        </>
    );
}

function Keeper({ u }) {
    return (
        <g className={s.breathe}>
            <path
                d="M406 372C406 312 432 292 480 292C528 292 554 312 554 372Z"
                fill={u("shirt")}
            />
            <path
                d="M451 308H509L517 372H443Z"
                fill="#efe2c6"
                stroke="#cdbb98"
                strokeWidth="1.5"
            />
            <path
                d="M456 310L440 296M504 310L520 296"
                stroke="#cdbb98"
                strokeWidth="3"
                strokeLinecap="round"
            />
            <rect
                x="396"
                y="316"
                width="28"
                height="46"
                rx="14"
                fill="#7d3326"
            />
            <circle cx="410" cy="350" r="10" fill={u("skin")} />
            <rect
                x="536"
                y="316"
                width="28"
                height="46"
                rx="14"
                fill="#7d3326"
            />
            <circle cx="552" cy="347" r="10" fill={u("skin")} />
            <rect
                x="560"
                y="322"
                width="26"
                height="26"
                rx="5"
                fill="#b88a3e"
                stroke="#6b4a1d"
                strokeWidth="1.5"
            />
            <path
                d="M586 328C598 328 598 342 586 342"
                fill="none"
                stroke="#6b4a1d"
                strokeWidth="3.5"
                strokeLinecap="round"
            />
            <ellipse cx="573" cy="322" rx="13" ry="4.5" fill="#f4ecd8" />
            <rect
                x="470"
                y="284"
                width="20"
                height="14"
                rx="6"
                fill="#c99a72"
            />
            <path
                d="M454 262C452 236 468 222 480 222C494 222 508 236 506 262C498 246 462 246 454 262Z"
                fill="#6b4a2b"
            />
            <circle cx="480" cy="262" r="28" fill={u("skin")} />
            <path
                d="M452 258C450 232 468 220 480 220C496 220 510 232 508 258C500 242 460 242 452 258Z"
                fill="#6b4a2b"
            />
            <path
                d="M453 268C453 302 470 316 480 316C490 316 507 302 507 268C498 286 462 286 453 268Z"
                fill="#5a3b22"
            />
            <ellipse cx="480" cy="268" rx="5.5" ry="4.5" fill="#d3a077" />
            <Eyes cx={480} cy={258} gap={13} />
            <path
                d="M460 250Q467 246 474 250M486 250Q493 246 500 250"
                fill="none"
                stroke="#4a3320"
                strokeWidth="2.4"
                strokeLinecap="round"
            />
            <path
                d="M461 275C470 266 478 272 480 275C482 272 490 266 499 275C492 286 484 281 480 279C476 281 468 286 461 275Z"
                fill="#3b2616"
            />
            <circle cx="462" cy="268" r="6" fill="#e0756a" opacity="0.22" />
            <circle cx="498" cy="268" r="6" fill="#e0756a" opacity="0.22" />
        </g>
    );
}

function Merchant({ u }) {
    return (
        <g className={s.breatheLate}>
            <path
                d="M684 384C684 342 716 326 762 326C808 326 840 342 840 384Z"
                fill={u("cloak")}
            />
            <path
                d="M740 330L762 366L784 330"
                fill="#5a3a20"
                stroke="#3b2616"
                strokeWidth="1.5"
            />
            <circle cx="762" cy="352" r="6" fill="#d6b25e" />
            <circle cx="762" cy="352" r="2.4" fill="#fff0b0" />
            <rect
                x="706"
                y="338"
                width="26"
                height="38"
                rx="13"
                fill="#245848"
            />
            <circle cx="722" cy="370" r="9" fill={u("skin")} />
            <rect
                x="792"
                y="338"
                width="26"
                height="38"
                rx="13"
                fill="#245848"
            />
            <circle cx="802" cy="370" r="9" fill={u("skin")} />
            <rect
                x="752"
                y="314"
                width="20"
                height="14"
                rx="6"
                fill="#b98962"
            />
            <circle cx="762" cy="302" r="23" fill={u("skin")} />
            <path
                d="M744 312C746 330 756 336 762 336C768 336 778 330 780 312C772 322 752 322 744 312Z"
                fill="#3b2a22"
            />
            <path
                d="M749 313C756 308 760 312 762 314C764 312 768 308 775 313C770 320 765 317 762 316C759 317 754 320 749 313Z"
                fill="#2a1d17"
            />
            <ellipse cx="762" cy="307" rx="4.5" ry="3.6" fill="#cf9b70" />
            <Eyes cx={762} cy={298} gap={10} r={2.8} />
            <path
                d="M750 290Q756 287 761 290M763 290Q768 287 774 290"
                fill="none"
                stroke="#3b2a22"
                strokeWidth="2.2"
                strokeLinecap="round"
            />
            <ellipse cx="762" cy="284" rx="54" ry="11" fill="#54397a" />
            <path
                d="M722 284C720 244 742 230 762 230C782 230 804 244 802 284C786 292 738 292 722 284Z"
                fill={u("hat")}
            />
            <path
                d="M723 276C744 284 780 284 801 276"
                fill="none"
                stroke="#d6b25e"
                strokeWidth="5"
            />
            <circle cx="762" cy="281" r="4" fill="#fff0b0" />
        </g>
    );
}

function Mage({ u }) {
    return (
        <g>
            <ellipse
                cx="246"
                cy="450"
                rx="54"
                ry="8"
                fill="#000"
                opacity="0.35"
            />
            <line
                x1="196"
                y1="326"
                x2="196"
                y2="452"
                stroke="#6b4a2b"
                strokeWidth="6"
                strokeLinecap="round"
            />
            <circle
                className={s.orbGlow}
                cx="196"
                cy="318"
                r="30"
                fill={u("orb")}
            />
            <circle cx="196" cy="318" r="10" fill="#bff4ff" />
            <circle cx="193" cy="315" r="3.4" fill="#fff" opacity="0.9" />
            <path
                d="M198 450C202 408 212 386 228 378H264C280 386 290 408 294 450Q246 462 198 450Z"
                fill={u("robe")}
            />
            <path
                d="M210 408Q246 420 282 408"
                fill="none"
                stroke="#d6b25e"
                strokeWidth="4"
                strokeLinecap="round"
            />
            <path
                d="M200 446Q246 458 292 446"
                fill="none"
                stroke="#8a6cd0"
                strokeWidth="3"
                opacity="0.7"
            />
            <path
                d="M230 390C216 396 208 402 202 410"
                fill="none"
                stroke="#4a2f85"
                strokeWidth="17"
                strokeLinecap="round"
            />
            <circle cx="198" cy="410" r="6.5" fill={u("skin")} />
            <path
                d="M262 390C274 400 278 412 274 424"
                fill="none"
                stroke="#4a2f85"
                strokeWidth="17"
                strokeLinecap="round"
            />
            <circle cx="274" cy="428" r="6.5" fill={u("skin")} />
            <circle cx="246" cy="364" r="20" fill={u("skin")} />
            <path
                d="M227 368C227 400 240 416 246 418C252 416 265 400 265 368C256 384 236 384 227 368Z"
                fill="#ececf4"
            />
            <ellipse cx="246" cy="373" rx="5" ry="4" fill="#cf9b70" />
            <Eyes cx={246} cy={364} gap={8.5} r={2.4} />
            <path
                d="M234 358Q240 355 244 358M248 358Q252 355 258 358"
                fill="none"
                stroke="#ececf4"
                strokeWidth="3"
                strokeLinecap="round"
            />
            <ellipse cx="246" cy="352" rx="42" ry="9" fill="#2f2e66" />
            <path
                d="M212 352C218 326 232 300 264 284C254 306 262 332 280 352C262 358 232 358 212 352Z"
                fill={u("mageHat")}
            />
            <path
                d="M214 348Q246 358 278 348"
                fill="none"
                stroke="#d6b25e"
                strokeWidth="4"
            />
            <path
                d="M240 332l2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.3 2.8 1-5.9-4.2-4.1 5.8-.8z"
                fill="#f6d98a"
            />
        </g>
    );
}

function Bottle({ x, color }) {
    return (
        <g>
            <rect x={x + 5} y="198" width="8" height="14" rx="2" fill={color} />
            <rect
                x={x + 6}
                y="193"
                width="6"
                height="7"
                rx="2"
                fill="#a77a45"
            />
            <rect x={x} y="210" width="18" height="26" rx="7" fill={color} />
            <rect
                x={x + 3}
                y="214"
                width="3"
                height="16"
                rx="1.5"
                fill="#fff"
                opacity="0.28"
            />
        </g>
    );
}

function Barrel({ x, y, w, h }) {
    const bulge = w * 0.1;

    return (
        <g>
            <ellipse
                cx={x + w / 2}
                cy={y + h + 2}
                rx={w * 0.6}
                ry="7"
                fill="#000"
                opacity="0.3"
            />
            <path
                d={`M${x} ${y} Q${x - bulge} ${y + h / 2} ${x} ${y + h} H${x + w} Q${x + w + bulge} ${y + h / 2} ${x + w} ${y} Z`}
                fill="url(#tv-barrel)"
            />
            {[0.22, 0.78].map((k) => (
                <path
                    key={k}
                    d={`M${x - bulge * 0.7} ${y + h * k} Q${x + w / 2} ${y + h * k + 7} ${x + w + bulge * 0.7} ${y + h * k}`}
                    fill="none"
                    stroke="#2a1a10"
                    strokeWidth="4"
                />
            ))}
            <ellipse
                cx={x + w / 2}
                cy={y}
                rx={w / 2}
                ry="8"
                fill="#7a5532"
                stroke="#3b2616"
                strokeWidth="2"
            />
        </g>
    );
}

export default function TavernArt({ id }) {
    const u = (n) => `url(#${id}-${n})`;

    return (
        <svg className={s.art} viewBox="0 0 960 540" aria-hidden="true">
            <defs>
                <linearGradient id={`${id}-wall`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#52341e" />
                    <stop offset="1" stopColor="#35200f" />
                </linearGradient>
                <pattern
                    id={`${id}-planks`}
                    width="72"
                    height="40"
                    patternUnits="userSpaceOnUse"
                >
                    <path
                        d="M0 0V40"
                        stroke="#1f1208"
                        strokeWidth="2"
                        opacity="0.45"
                    />
                    <path
                        d="M36 0V40"
                        stroke="#1f1208"
                        strokeWidth="1"
                        opacity="0.2"
                    />
                    <ellipse
                        cx="20"
                        cy="14"
                        rx="3"
                        ry="5"
                        fill="#2a180b"
                        opacity="0.25"
                    />
                </pattern>
                <linearGradient id={`${id}-floor`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#3f2815" />
                    <stop offset="1" stopColor="#1e110a" />
                </linearGradient>
                <pattern
                    id={`${id}-boards`}
                    width="150"
                    height="34"
                    patternUnits="userSpaceOnUse"
                >
                    <path
                        d="M0 33H150"
                        stroke="#150a05"
                        strokeWidth="2.5"
                        opacity="0.55"
                    />
                    <path
                        d="M75 0V33"
                        stroke="#150a05"
                        strokeWidth="1.5"
                        opacity="0.35"
                    />
                </pattern>
                <pattern
                    id={`${id}-stone`}
                    width="44"
                    height="24"
                    patternUnits="userSpaceOnUse"
                >
                    <rect width="44" height="24" fill="#5a544d" />
                    <path
                        d="M0 23H44M22 0V12M0 12H44M0 0V12"
                        stroke="#37322d"
                        strokeWidth="2"
                    />
                </pattern>
                <linearGradient id={`${id}-wood`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#8a5c32" />
                    <stop offset="1" stopColor="#5a3a1f" />
                </linearGradient>
                <linearGradient
                    id={`${id}-counter`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                >
                    <stop offset="0" stopColor="#6b4423" />
                    <stop offset="1" stopColor="#3f2714" />
                </linearGradient>
                <linearGradient id={`${id}-cloth`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#7a2a34" />
                    <stop offset="1" stopColor="#4a1620" />
                </linearGradient>
                <linearGradient id="tv-barrel" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#4a2f18" />
                    <stop offset="0.45" stopColor="#7a5230" />
                    <stop offset="1" stopColor="#3a2412" />
                </linearGradient>
                <linearGradient id={`${id}-night`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#141c38" />
                    <stop offset="1" stopColor="#2c4272" />
                </linearGradient>
                <linearGradient id={`${id}-flame`} x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0" stopColor="#e8742a" />
                    <stop offset="1" stopColor="#d6342a" />
                </linearGradient>
                <radialGradient id={`${id}-lamp`}>
                    <stop offset="0" stopColor="#ffb55a" stopOpacity="0.5" />
                    <stop offset="1" stopColor="#ffb55a" stopOpacity="0" />
                </radialGradient>
                <radialGradient id={`${id}-fire`}>
                    <stop offset="0" stopColor="#ff8a3a" stopOpacity="0.5" />
                    <stop offset="1" stopColor="#ff8a3a" stopOpacity="0" />
                </radialGradient>
                <radialGradient id={`${id}-moon`}>
                    <stop offset="0" stopColor="#f1ecc8" stopOpacity="0.7" />
                    <stop offset="1" stopColor="#f1ecc8" stopOpacity="0" />
                </radialGradient>
                <radialGradient id={`${id}-orb`}>
                    <stop offset="0" stopColor="#8ff0ff" stopOpacity="0.8" />
                    <stop offset="1" stopColor="#7fe8ff" stopOpacity="0" />
                </radialGradient>
                <radialGradient id={`${id}-skin`} cx="0.4" cy="0.35" r="0.75">
                    <stop offset="0" stopColor="#f0c8a0" />
                    <stop offset="1" stopColor="#d49d72" />
                </radialGradient>
                <linearGradient id={`${id}-shirt`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#a04434" />
                    <stop offset="1" stopColor="#7a2e22" />
                </linearGradient>
                <linearGradient id={`${id}-cloak`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#3a8670" />
                    <stop offset="1" stopColor="#245848" />
                </linearGradient>
                <linearGradient id={`${id}-hat`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#7a56a8" />
                    <stop offset="1" stopColor="#54397a" />
                </linearGradient>
                <linearGradient id={`${id}-robe`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#6b46b8" />
                    <stop offset="1" stopColor="#3b2670" />
                </linearGradient>
                <linearGradient
                    id={`${id}-mageHat`}
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                >
                    <stop offset="0" stopColor="#4a4a9a" />
                    <stop offset="1" stopColor="#2f2e66" />
                </linearGradient>
            </defs>

            <rect width="960" height="390" fill={u("wall")} />
            <rect width="960" height="390" fill={u("planks")} />
            <rect width="960" height="30" fill="#24150a" />
            <rect y="30" width="960" height="8" fill="#150c05" opacity="0.5" />
            <rect width="34" height="390" fill="#24150a" />
            <rect x="926" width="34" height="390" fill="#24150a" />
            <rect y="384" width="960" height="156" fill={u("floor")} />
            <rect y="384" width="960" height="156" fill={u("boards")} />
            <rect
                y="384"
                width="960"
                height="10"
                fill="#150a05"
                opacity="0.45"
            />
            <ellipse
                cx="480"
                cy="500"
                rx="250"
                ry="30"
                fill="#6a2630"
                opacity="0.5"
            />
            <ellipse
                cx="480"
                cy="500"
                rx="232"
                ry="24"
                fill="none"
                stroke="#d6b25e"
                strokeWidth="2"
                opacity="0.35"
            />

            <rect
                x="366"
                y="54"
                width="228"
                height="168"
                rx="10"
                fill="#7a5232"
            />
            <rect
                x="382"
                y="70"
                width="196"
                height="136"
                rx="4"
                fill={u("night")}
            />
            <circle cx="540" cy="108" r="40" fill={u("moon")} />
            <circle cx="540" cy="108" r="15" fill="#f1ecc8" />
            <circle cx="545" cy="104" r="12" fill="#26385f" opacity="0.28" />
            {[
                [412, 96],
                [446, 150],
                [500, 90],
                [520, 176],
                [420, 184],
            ].map(([x, y]) => (
                <circle
                    key={x}
                    cx={x}
                    cy={y}
                    r="2"
                    fill="#c9d4ff"
                    opacity="0.85"
                />
            ))}
            <rect x="476" y="70" width="8" height="136" fill="#7a5232" />
            <rect x="382" y="130" width="196" height="8" fill="#7a5232" />
            <rect
                x="356"
                y="218"
                width="248"
                height="14"
                rx="4"
                fill={u("wood")}
            />

            <rect
                x="656"
                y="236"
                width="238"
                height="12"
                rx="4"
                fill={u("wood")}
            />
            {[
                "#5aa06a",
                "#a8483a",
                "#c9a24a",
                "#5a7ac0",
                "#a8483a",
                "#5aa06a",
                "#c9a24a",
            ].map((c, i) => (
                <Bottle key={i} x={668 + i * 31} color={c} />
            ))}

            <rect
                x="22"
                y="104"
                width="282"
                height="30"
                rx="5"
                fill="#74634f"
            />
            <rect x="22" y="104" width="282" height="6" rx="3" fill="#8f7d66" />
            <rect x="38" y="134" width="250" height="250" fill={u("stone")} />
            <path
                d="M84 384V252Q84 204 163 204Q242 204 242 252V384Z"
                fill="#120a06"
            />
            <circle cx="163" cy="340" r="150" fill={u("fire")} />
            <g className={s.flameA}>
                <path
                    d="M126 376C118 342 142 332 148 298C162 320 176 314 180 290C198 322 210 348 198 376Z"
                    fill={u("flame")}
                />
            </g>
            <g className={s.flameB}>
                <path
                    d="M144 376C140 352 154 346 160 322C170 340 182 348 178 376Z"
                    fill="#f6c453"
                />
            </g>
            <rect
                x="104"
                y="366"
                width="118"
                height="16"
                rx="8"
                fill="#4a2f18"
                transform="rotate(-4 163 374)"
            />
            <rect
                x="112"
                y="372"
                width="104"
                height="12"
                rx="6"
                fill="#5a3a1f"
                transform="rotate(5 163 378)"
            />
            <rect
                x="52"
                y="384"
                width="222"
                height="12"
                rx="3"
                fill="#3f3a35"
            />

            <circle
                className={s.lampGlow}
                cx="624"
                cy="80"
                r="230"
                fill={u("lamp")}
            />
            <line
                x1="624"
                y1="30"
                x2="624"
                y2="50"
                stroke="#24150a"
                strokeWidth="3"
            />
            <path d="M606 56L642 56L636 46L612 46Z" fill="#3b2616" />
            <rect x="607" y="56" width="34" height="38" rx="9" fill="#d6a54a" />
            <rect x="614" y="62" width="20" height="26" rx="6" fill="#fff0b0" />
            <rect x="607" y="92" width="34" height="6" rx="3" fill="#3b2616" />

            <Mage u={u} />

            <Keeper u={u} />

            <ellipse
                cx="480"
                cy="450"
                rx="170"
                ry="9"
                fill="#000"
                opacity="0.35"
            />
            <rect
                x="324"
                y="348"
                width="312"
                height="22"
                rx="5"
                fill={u("wood")}
            />
            <rect
                x="324"
                y="348"
                width="312"
                height="4"
                rx="2"
                fill="#a77a45"
                opacity="0.8"
            />
            <rect x="330" y="370" width="300" height="76" fill={u("counter")} />
            {[0, 1, 2].map((i) => (
                <rect
                    key={i}
                    x={344 + i * 98}
                    y="380"
                    width="84"
                    height="54"
                    rx="5"
                    fill="none"
                    stroke="#2a180b"
                    strokeWidth="3"
                    opacity="0.7"
                />
            ))}
            <rect x="324" y="440" width="312" height="8" fill="#2a180b" />
            <rect
                x="348"
                y="324"
                width="24"
                height="24"
                rx="5"
                fill="#b88a3e"
                stroke="#6b4a1d"
                strokeWidth="1.5"
            />
            <ellipse cx="360" cy="324" rx="12" ry="4.5" fill="#f4ecd8" />
            <path
                d="M372 330C383 330 383 342 372 342"
                fill="none"
                stroke="#6b4a1d"
                strokeWidth="3.5"
                strokeLinecap="round"
            />
            <ellipse cx="400" cy="346" rx="12" ry="3.4" fill="#c9a24a" />
            <ellipse cx="400" cy="342" rx="12" ry="3.4" fill="#d6b25e" />
            <rect x="598" y="340" width="26" height="8" rx="2" fill="#7a2a34" />
            <rect x="600" y="334" width="22" height="7" rx="2" fill="#efe2c6" />

            <Merchant u={u} />
            <rect
                x="676"
                y="372"
                width="224"
                height="16"
                rx="5"
                fill={u("wood")}
            />
            <rect
                x="676"
                y="372"
                width="224"
                height="3"
                rx="1.5"
                fill="#a77a45"
                opacity="0.8"
            />
            <path
                d="M688 388H888V470C876 482 864 470 852 480C840 470 828 482 816 470C804 482 792 470 780 480C768 470 756 482 744 470C732 482 720 470 708 480C698 472 692 478 688 470Z"
                fill={u("cloth")}
            />
            <path
                d="M688 396H888"
                stroke="#d6b25e"
                strokeWidth="3"
                opacity="0.6"
            />
            <ellipse
                cx="788"
                cy="488"
                rx="110"
                ry="8"
                fill="#000"
                opacity="0.28"
            />
            <path
                d="M694 372C690 352 702 342 716 346C730 342 742 352 738 372Z"
                fill="#6b4a2b"
                stroke="#3b2616"
                strokeWidth="1.5"
            />
            <path d="M706 346L716 338L726 346" fill="#3b2616" />
            <circle cx="716" cy="360" r="4" fill="#d6b25e" />
            {[0, 1, 2].map((i) => (
                <ellipse
                    key={i}
                    cx="850"
                    cy={368 - i * 4}
                    rx="13"
                    ry="3.6"
                    fill={i % 2 ? "#c9a24a" : "#d6b25e"}
                />
            ))}
            <rect
                x="868"
                y="338"
                width="18"
                height="30"
                rx="7"
                fill="#a8483a"
            />
            <rect
                x="872"
                y="326"
                width="10"
                height="14"
                rx="3"
                fill="#a8483a"
            />
            <rect x="873" y="320" width="8" height="8" rx="2" fill="#a77a45" />
            <rect
                x="871"
                y="344"
                width="3"
                height="16"
                rx="1.5"
                fill="#fff"
                opacity="0.3"
            />

            <Barrel x={40} y={424} w={80} h={80} />
            <Barrel x={140} y={454} w={60} h={52} />
        </svg>
    );
}
