import { motion } from "motion/react";
import { EASE_OUT } from "./ease";
import s from "./transition.module.css";

const DOC = [78, 62, 90, 45, 70, 56, 84];
function Stamp({ delay, reduce }) {
    return (
        <div className={s.stampWrap}>
            <div className={s.doc}>
                {DOC.map((w, i) => (
                    <i key={i} style={{ width: `${w}%` }} />
                ))}
            </div>
            <motion.div
                className={s.stamp}
                initial={{
                    opacity: 0,
                    transform: `rotate(-9deg) scale(${reduce ? 1 : 1.4})`,
                }}
                animate={{
                    opacity: 1,
                    transform: "rotate(-9deg) scale(1)",
                    transition: { delay, duration: 0.14, ease: EASE_OUT },
                }}
            >
                <b>CLOSED BETA</b>
                <span>NOT FOR DISTRIBUTION</span>
            </motion.div>
        </div>
    );
}

function Hazard({ delayMs }) {
    return (
        <div className={s.hazard}>
            <div className={s.band}>
                <i className={s.bandInner} />
            </div>
            <div className={s.lights} style={{ "--d": `${delayMs}ms` }}>
                <i className={`${s.lamp} ${s.lampRed}`} />
                <i className={`${s.lamp} ${s.lampGreen}`} />
            </div>
            <div className={s.band}>
                <i className={s.bandInner} />
            </div>
        </div>
    );
}

const STAR = [0, 2, 4, 1, 3]
    .map((k) => {
        const a = ((-90 + k * 72) * Math.PI) / 180;
        return `${(96 * Math.cos(a)).toFixed(1)},${(96 * Math.sin(a)).toFixed(1)}`;
    })
    .join(" ");

function Runes() {
    return (
        <svg className={s.runes} viewBox="-160 -160 320 320">
            <g className={s.ringOuter}>
                <circle r="150" />
                <circle r="157" strokeDasharray="1 9" />
                <circle r="122" />
                {Array.from({ length: 12 }, (_, i) => (
                    <path
                        key={i}
                        transform={`rotate(${i * 30})`}
                        d={
                            i % 2
                                ? "M0 -128 V-146 M-5 -139 L0 -146 L5 -139"
                                : "M-5 -128 V-146 M5 -128 V-146 M-5 -137 H5"
                        }
                    />
                ))}
            </g>
            <g className={s.ringInner}>
                <circle r="96" />
                <polygon points={STAR} />
                <circle r="60" strokeDasharray="4 6" />
            </g>
            <circle className={s.runeCore} r="6" />
        </svg>
    );
}

const WAVE =
    "M0 100H40L52 62L64 138L76 100H150L160 34L178 166L194 100H262L274 72L286 128L298 100H370L382 52L398 148L412 100H480";

function Signal() {
    return (
        <svg className={s.scope} viewBox="0 0 480 200">
            <g className={s.scopeGrid}>
                {[40, 80, 120, 160].map((y) => (
                    <line key={y} x1="0" x2="480" y1={y} y2={y} />
                ))}
                {[80, 160, 240, 320, 400].map((x) => (
                    <line key={x} x1={x} x2={x} y1="0" y2="200" />
                ))}
            </g>
            <g className={s.waveMove}>
                <path className={s.wave} d={WAVE} />
                <path
                    className={s.wave}
                    d={WAVE}
                    transform="translate(480 0)"
                />
            </g>
        </svg>
    );
}

const MOTIFS = { stamp: Stamp, hazard: Hazard, runes: Runes, signal: Signal };

export default function Motif({ kind, delay, delayMs, reduce }) {
    const Drawing = MOTIFS[kind] ?? Signal;

    return (
        <motion.div
            className={s.motifBody}
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay, duration: 0.25 } }}
        >
            <Drawing delay={delay} delayMs={delayMs} reduce={reduce} />
        </motion.div>
    );
}
