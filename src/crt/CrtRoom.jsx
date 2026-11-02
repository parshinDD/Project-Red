import { useEffect, useRef } from "react";
import {
    play,
    setAmbience,
    attachLamp,
    detachLamp,
    STAGE_AMBIENCE,
} from "@/audio/audioEngine";
import { HAZE, HAZE_FRONT, WALL_BASE, WALL_STAINS, GRAIN } from "./textures";
import { wallCracks, wallScuffs } from "./wall";
import { BARREL_MAP, BARREL_SCALE } from "./barrel";
import s from "./crt.module.css";

const DUST = [
    [18, 22, 2, 38, 0],
    [27, 58, 1.5, 46, 4],
    [34, 35, 2.5, 52, 9],
    [43, 18, 1.5, 41, 2],
    [52, 66, 2, 57, 6],
    [61, 28, 1.5, 44, 11],
    [68, 52, 2.5, 49, 1],
    [76, 20, 2, 55, 7],
    [83, 62, 1.5, 40, 3],
    [12, 70, 2, 60, 12],
    [90, 36, 1.5, 47, 5],
    [47, 44, 2, 53, 8],
];

const WALL_TEXT = [
    {
        kind: "marker",
        x: 5.5,
        y: 8,
        size: 1.35,
        rot: -4,
        text: "FIX LAMP - TODO",
    },
    {
        kind: "pencil",
        x: 3,
        y: 30,
        size: 1.05,
        rot: -2,
        text: "HAVE YOU TRIED\nTURNING IT OFF\nAND ON AGAIN?",
    },
    {
        kind: "chalk",
        x: 4,
        y: 62,
        size: 1.2,
        rot: 3,
        text: "THE CAT WAS\nHERE FIRST",
    },
    {
        kind: "pencil",
        x: 3.5,
        y: 78,
        size: 0.85,
        rot: -1.5,
        text: "NO ONE REMEMBERS WHO\nLOGGED IN FIRST",
    },
    { kind: "carved", x: 80.5, y: 12, size: 2.1, rot: 1.5, text: "NOT A BUG" },
    {
        kind: "carved",
        x: 82,
        y: 19.5,
        size: 0.9,
        rot: 1.5,
        text: "(A FEATURE)",
    },
    { kind: "carved", x: 80, y: 68, size: 2.6, rot: -2, text: "02-12" },
    {
        kind: "chalk",
        x: 79.5,
        y: 79,
        size: 0.85,
        rot: 1,
        text: "build number: not random",
    },
];
const CRACKS = wallCracks();
const SCUFFS = wallScuffs();

const MOOD_LED = {
    dark: "standby",
    boot: "standby",
    alert: "alert",
    contract: "idle",
    online: "idle",
    alarm: "alert",
    final: "idle",
    blackout: "off",
};
let lastPowerOn = -1e9;
const flick = (...names) => [...names.map((n) => s[n]), s.lampFlick].join(" ");

export default function CrtRoom({
    mood = "boot",
    cut = null,
    led = null,
    inert = false,
    children,
}) {
    const roomRef = useRef(null);
    const prevMood = useRef(null);

    useEffect(() => {
        const room = roomRef.current;
        if (!room) return;

        const css = getComputedStyle(room);
        const num = (name) => parseFloat(css.getPropertyValue(name)) || 0;

        setAmbience(
            { screen: num("--sglow"), lamp: num("--lamp"), room: 1 },
            1.2,
        );

        const anim =
            mood === "blackout"
                ? null
                : room
                      .querySelector(`.${s.lampFlick}`)
                      ?.getAnimations?.()
                      .find((a) => a.animationName);

        if (anim) attachLamp(anim);
        else detachLamp();

        const before = prevMood.current;
        prevMood.current = mood;

        if (before && before !== mood) {
            if (mood === "blackout") play("powerDown");
            else if (before === "blackout") play("powerUp");
            else if (mood === "alert" || mood === "alarm") play("degauss");
        }
    }, [mood]);

    useEffect(() => {
        const t = performance.now();
        if (t - lastPowerOn > 1500) {
            lastPowerOn = t;
            play("powerOn");
        }

        return () => {
            detachLamp();
            setAmbience(STAGE_AMBIENCE, 0.4);
        };
    }, []);

    useEffect(() => {
        if (cut === "out") play("scanOut");
        else if (cut === "in") play("scanIn");
    }, [cut]);

    return (
        <div className={s.room} data-mood={mood} ref={roomRef}>
            <svg
                className={s.defs}
                width="0"
                height="0"
                aria-hidden="true"
                focusable="false"
            >
                <defs>
                    <filter
                        id="crt-bend"
                        x="0"
                        y="0"
                        width="100%"
                        height="100%"
                        colorInterpolationFilters="sRGB"
                    >
                        <feImage
                            href={BARREL_MAP}
                            preserveAspectRatio="none"
                            result="map"
                        />
                        <feDisplacementMap
                            in="SourceGraphic"
                            in2="map"
                            scale={BARREL_SCALE}
                            xChannelSelector="R"
                            yChannelSelector="G"
                        />
                    </filter>
                    <filter
                        id="crt-tube"
                        x="0"
                        y="0"
                        width="100%"
                        height="100%"
                        colorInterpolationFilters="sRGB"
                    >
                        <feImage
                            href={BARREL_MAP}
                            preserveAspectRatio="none"
                            result="map"
                        />
                        <feDisplacementMap
                            in="SourceGraphic"
                            in2="map"
                            scale={BARREL_SCALE}
                            xChannelSelector="R"
                            yChannelSelector="G"
                            result="bent"
                        />
                        <feColorMatrix
                            in="bent"
                            type="matrix"
                            values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
                            result="r"
                        />
                        <feColorMatrix
                            in="bent"
                            type="matrix"
                            values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
                            result="g"
                        />
                        <feColorMatrix
                            in="bent"
                            type="matrix"
                            values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
                            result="b"
                        />
                        <feOffset in="r" dx="-0.8" result="ro" />
                        <feOffset in="b" dx="0.8" result="bo" />
                        <feBlend in="ro" in2="g" mode="screen" result="rg" />
                        <feBlend
                            in="rg"
                            in2="bo"
                            mode="screen"
                            result="split"
                        />
                        <feGaussianBlur
                            in="split"
                            stdDeviation="0.45 0.35"
                            result="soft"
                        />
                        <feGaussianBlur
                            in="split"
                            stdDeviation="7"
                            result="halo"
                        />
                        <feColorMatrix
                            in="halo"
                            type="matrix"
                            values="1.5 0 0 0 0  0 0.3 0 0 0  0 0 0.42 0 0  0 0 0 1.2 0"
                            result="haloRed"
                        />
                        <feMerge>
                            <feMergeNode in="haloRed" />
                            <feMergeNode in="soft" />
                        </feMerge>
                    </filter>
                    <filter
                        id="wall-ink"
                        x="-5%"
                        y="-20%"
                        width="110%"
                        height="140%"
                        colorInterpolationFilters="sRGB"
                    >
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.9"
                            numOctaves="2"
                            seed="3"
                            result="n"
                        />
                        <feDisplacementMap
                            in="SourceGraphic"
                            in2="n"
                            scale="2.4"
                            xChannelSelector="R"
                            yChannelSelector="G"
                            result="w"
                        />
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.5"
                            numOctaves="3"
                            seed="8"
                            result="n2"
                        />
                        <feColorMatrix
                            in="n2"
                            type="matrix"
                            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.6 1.85"
                            result="cover"
                        />
                        <feComposite in="w" in2="cover" operator="in" />
                    </filter>
                    <filter
                        id="wall-carve"
                        x="-5%"
                        y="-20%"
                        width="110%"
                        height="140%"
                        colorInterpolationFilters="sRGB"
                    >
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.7"
                            numOctaves="2"
                            seed="5"
                            result="n"
                        />
                        <feDisplacementMap
                            in="SourceGraphic"
                            in2="n"
                            scale="1.6"
                            xChannelSelector="R"
                            yChannelSelector="G"
                        />
                    </filter>
                </defs>
            </svg>

            <div
                className={s.wallTex}
                style={{ backgroundImage: WALL_BASE }}
                aria-hidden="true"
            />
            <div
                className={s.wallStains}
                style={{ backgroundImage: WALL_STAINS }}
                aria-hidden="true"
            />
            <svg
                className={s.cracks}
                viewBox="0 0 1600 1000"
                preserveAspectRatio="xMidYMid slice"
                aria-hidden="true"
            >
                <g className={s.crackLight} transform="translate(1.3 1.5)">
                    {CRACKS.map((d, i) => (
                        <path key={i} d={d} />
                    ))}
                </g>
                <g className={s.crackDark}>
                    {CRACKS.map((d, i) => (
                        <path key={i} d={d} />
                    ))}
                </g>
                <g className={s.scuffs}>
                    {SCUFFS.map((d, i) => (
                        <path key={i} d={d} />
                    ))}
                </g>
            </svg>
            <div className={s.wallText} aria-hidden="true">
                {WALL_TEXT.map((w) => (
                    <span
                        key={w.text}
                        className={`${s.wt} ${s[w.kind]}`}
                        style={{
                            left: `${w.x}%`,
                            top: `${w.y}%`,
                            fontSize: `${w.size}cqw`,
                            transform: `rotate(${w.rot}deg)`,
                        }}
                    >
                        {w.text}
                    </span>
                ))}
                <svg
                    className={`${s.wt} ${s.tally}`}
                    style={{ left: "81%", top: "40%", width: "7cqw" }}
                    viewBox="0 0 70 34"
                >
                    {[0, 12, 24, 36].map((x) => (
                        <line key={x} x1={6 + x} y1="4" x2={7 + x} y2="30" />
                    ))}
                    <line x1="2" y1="26" x2="52" y2="8" />
                    {[0, 12].map((x) => (
                        <line
                            key={x + 100}
                            x1={58 + x * 0.5}
                            y1="4"
                            x2={59 + x * 0.5}
                            y2="30"
                        />
                    ))}
                </svg>
            </div>
            <div className={s.wallDark} aria-hidden="true" />
            <div className={s.wallLight} aria-hidden="true" />
            <div
                className={`${s.haze} ${s.hazeBack}`}
                style={{ backgroundImage: HAZE }}
                aria-hidden="true"
            />

            <div className={s.lampWrap} aria-hidden="true">
                <div className={flick("pool")} />
            </div>

            <div className={s.desk} aria-hidden="true">
                <div className={s.deskSheen} />
                <div className={flick("deskLamp")} />
                <div className={s.keyboard}>
                    <i />
                </div>
            </div>

            <div className={s.rig}>
                <div className={s.deskLight} aria-hidden="true" />
                <div className={s.contact} aria-hidden="true" />
                <div className={s.bloom} aria-hidden="true" />

                <div className={s.monitor}>
                    <div className={s.topface} aria-hidden="true">
                        <i className={flick("topLit")} />
                    </div>
                    <div className={s.bezel}>
                        <div
                            className={s.plastic}
                            style={{ backgroundImage: GRAIN }}
                            aria-hidden="true"
                        />
                        <div className={flick("bezelLit")} aria-hidden="true" />

                        <div className={s.glassFrame}>
                            <div className={s.spill} aria-hidden="true" />
                            <div className={s.glass}>
                                <div
                                    className={s.glassGlow}
                                    aria-hidden="true"
                                />

                                <div className={s.tube}>
                                    <div
                                        className={s.cutLayer}
                                        data-cut={cut ?? undefined}
                                    >
                                        <div
                                            className={s.raster}
                                            aria-hidden="true"
                                        />
                                        <main
                                            className={s.content}
                                            id="stage"
                                            inert={inert}
                                        >
                                            {children}
                                        </main>
                                    </div>
                                    <div
                                        className={s.sweep}
                                        data-cut={cut ?? undefined}
                                        aria-hidden="true"
                                    />
                                </div>

                                <div className={s.scan} aria-hidden="true" />
                                <div className={s.flickWrap} aria-hidden="true">
                                    <div className={s.flick} />
                                </div>
                                <div className={s.roll} aria-hidden="true" />
                                <div className={s.curve} aria-hidden="true" />

                                <div
                                    className={s.reflections}
                                    aria-hidden="true"
                                >
                                    <div className={s.veil} />
                                    <div className={s.blinds} />
                                    <div className={flick("lamp")} />
                                    <div className={s.lampSmall} />
                                </div>
                                <div className={s.rim} aria-hidden="true" />

                                <div className={s.beam} aria-hidden="true" />
                                <div
                                    className={s.powerFlash}
                                    aria-hidden="true"
                                />
                            </div>
                            <div className={s.gasket} aria-hidden="true" />
                        </div>
                    </div>
                    <div className={s.chin} aria-hidden="true">
                        <span className={s.brand}>
                            RED-TEK&nbsp;&nbsp;RT-212
                        </span>
                        <span className={s.vents} />
                        <span className={s.knobs}>
                            <i />
                            <i />
                        </span>
                        <span
                            className={s.led}
                            data-mode={led ?? MOOD_LED[mood] ?? "idle"}
                        />
                    </div>
                </div>
                <div className={s.neck} aria-hidden="true" />
                <div className={s.foot} aria-hidden="true" />
                <div className={s.deskReflect} aria-hidden="true">
                    <b />
                </div>
            </div>

            <div className={s.dust} aria-hidden="true">
                {DUST.map(([x, y, size, dur, delay], i) => (
                    <i
                        key={i}
                        style={{
                            left: `${x}%`,
                            top: `${y}%`,
                            width: size,
                            height: size,
                            animationDuration: `${dur}s, ${dur / 3}s`,
                            animationDelay: `${delay}s, ${delay}s`,
                        }}
                    />
                ))}
            </div>
            <div
                className={`${s.haze} ${s.hazeFront}`}
                style={{ backgroundImage: HAZE_FRONT }}
                aria-hidden="true"
            />
            <div
                className={s.grain}
                style={{ backgroundImage: GRAIN }}
                aria-hidden="true"
            />
            <div className={s.roomVignette} aria-hidden="true" />
        </div>
    );
}
