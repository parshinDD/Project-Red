import { useEffect, useState } from "react";
import { useSceneApi } from "@/game/hooks/useSceneApi";
import { grantJournal } from "@/game/rewards";
import { play } from "@/audio/audioEngine";
import { cx } from "@/lib/cx";
import TerminalButton from "@/ui/TerminalButton";
import CompletePanel from "@/ui/CompletePanel";
import LevelFrame from "@/ui/LevelFrame";
import {
    MAX,
    MIN,
    POINTS,
    START,
    STATS,
    TRIALS,
    runTrials,
    spent,
} from "./trials";
import s from "./level07.module.css";

const COMPLETE_LINES = [
    { text: "CHARACTER CREATED", tone: "title" },
    { text: "" },
    { text: "Class: CUSTOM" },
    { text: "Build validation: PASSED" },
    { text: "Origin: NOT FOUND", tone: "err", glitch: true, delay: 500 },
    { text: "", delay: 600 },
    {
        text: "This character was not in the original design document.",
        delay: 500,
    },
    { text: "" },
    {
        text: "The system has declined to explain why.",
        tone: "dim",
        delay: 700,
    },
];

const ICONS = {
    str: <path d="M5 19 19 5M15 4h5v5M4 20l3-3M7 14l3 3" />,
    dex: <path d="M8 4h6v8l5 3v5H6V4ZM6 17h13" />,
    int: <path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4ZM8 4v13" />,
    luck: (
        <>
            <circle cx="9" cy="9" r="3.5" />
            <circle cx="15" cy="9" r="3.5" />
            <circle cx="9" cy="15" r="3.5" />
            <circle cx="15" cy="15" r="3.5" />
            <path d="M12 12l5 8" />
        </>
    ),
};

function Rune({ id }) {
    return (
        <svg className={s.rune} viewBox="0 0 24 24" aria-hidden="true">
            {ICONS[id]}
        </svg>
    );
}

const SIGILS = [
    ["str", 22, 52],
    ["dex", 138, 52],
    ["int", 22, 132],
    ["luck", 138, 132],
];

const CORE = { x: 80, y: 108 };

const heat = (t) => {
    const r = Math.round(214 + 41 * t);
    const g = Math.round(178 - 106 * t);
    const b = Math.round(94 - 38 * t);

    return `rgb(${r} ${g} ${b})`;
};

const reducedMotion = () =>
    typeof window !== "undefined" &&
    !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const TONGUES = [
    { dx: 0, k: 1, delay: 0 },
    { dx: -9, k: 0.68, delay: -0.3 },
    { dx: 9, k: 0.68, delay: -0.6 },
];

function Hero({ stats }) {
    const total = spent(stats) / POINTS;
    const still = reducedMotion();

    return (
        <svg
            className={s.hero}
            viewBox="0 0 160 190"
            style={{ "--total": total }}
            aria-hidden="true"
        >
            <defs>
                <radialGradient id="l7-core">
                    <stop offset="0" stopColor="#ff6a3c" stopOpacity="0.95" />
                    <stop offset="0.45" stopColor="#d81f2e" stopOpacity="0.5" />
                    <stop offset="1" stopColor="#900020" stopOpacity="0" />
                </radialGradient>
            </defs>

            <circle className={s.aura} cx="80" cy="100" r="66" />
            <path
                className={s.cloak}
                d="M80 28C58 28 46 48 50 70 34 102 30 150 24 178H136C130 150 126 102 110 70 114 48 102 28 80 28Z"
            />
            <ellipse className={s.face} cx="80" cy="66" rx="17" ry="20" />
            <circle className={s.eye} cx="73" cy="64" r="2.2" />
            <circle className={s.eye} cx="87" cy="64" r="2.2" />

            <circle
                className={s.core}
                cx={CORE.x}
                cy={CORE.y}
                r={6 + total * 24}
                fill="url(#l7-core)"
                opacity={total === 0 ? 0 : 0.35 + total * 0.65}
            />

            {SIGILS.map(([id, x, y]) => {
                const v = stats[id];
                const t = v / MAX;
                const color = heat(t);
                const beam = `M${x} ${y} Q${(x + CORE.x) / 2} ${y} ${CORE.x} ${CORE.y}`;

                return (
                    <g
                        key={id}
                        className={s.power}
                        style={{ "--t": t, "--heat": color }}
                        data-on={v > 0 || undefined}
                    >
                        {v > 0 && (
                            <>
                                <path
                                    className={s.beamGlow}
                                    d={beam}
                                    strokeWidth={2 + t * 7}
                                    opacity={0.18 + t * 0.4}
                                />
                                <path
                                    className={s.beam}
                                    d={beam}
                                    strokeWidth={0.7 + t * 2.3}
                                />
                                {!still &&
                                    Array.from({ length: v }, (_, i) => {
                                        const dur = `${(1.9 - t * 0.7).toFixed(2)}s`;
                                        const begin = `${(i * 0.4).toFixed(2)}s`;

                                        return (
                                            <circle
                                                key={i}
                                                r={1.1 + t * 0.9}
                                                fill="#ffd9a8"
                                            >
                                                <animateMotion
                                                    path={beam}
                                                    dur={dur}
                                                    begin={begin}
                                                    repeatCount="indefinite"
                                                />
                                                <animate
                                                    attributeName="opacity"
                                                    values="0;1;1;0"
                                                    dur={dur}
                                                    begin={begin}
                                                    repeatCount="indefinite"
                                                />
                                            </circle>
                                        );
                                    })}
                            </>
                        )}

                        <g transform={`translate(${x - 12} ${y - 12})`}>
                            {v > 0 && (
                                <g
                                    className={s.flames}
                                    transform={`translate(12 -2) scale(${(0.45 + t * 0.95).toFixed(2)})`}
                                >
                                    {TONGUES.map((tg) => (
                                        <g
                                            key={tg.dx}
                                            transform={`translate(${tg.dx} 0) scale(${tg.k})`}
                                        >
                                            <path
                                                className={s.tongue}
                                                style={{
                                                    animationDelay: `${tg.delay}s`,
                                                }}
                                                d="M-5 0C-8 -8 -2 -12 -1 -21C4 -14 8 -8 5 0Z"
                                            />
                                            <path
                                                className={s.tongueCore}
                                                style={{
                                                    animationDelay: `${tg.delay}s`,
                                                }}
                                                d="M-2.2 0C-3.5 -5 -0.5 -8 0 -12C2.4 -8 3.6 -4 2.2 0Z"
                                            />
                                        </g>
                                    ))}
                                </g>
                            )}
                            <g
                                className={s.sigil}
                                style={{ opacity: v > 0 ? 0.75 + t * 0.25 : 0.28 }}
                            >
                                <circle
                                    cx="12"
                                    cy="12"
                                    r="15"
                                    className={s.sigilRing}
                                />
                                {ICONS[id]}
                            </g>
                        </g>
                    </g>
                );
            })}
        </svg>
    );
}

export default function Level07Character() {
    const { completed, complete, say, next } = useSceneApi(7);

    const [stats, setStats] = useState(START);
    const [report, setReport] = useState(null);
    const [done, setDone] = useState(completed);

    const remaining = POINTS - spent(stats);

    useEffect(() => {
        grantJournal("scroll-conditions");
    }, []);

    const change = (id, delta) => {
        if (done) return;

        if (delta > 0 && (stats[id] >= MAX || remaining <= 0)) return;

        if (delta < 0 && stats[id] <= MIN) return;

        play(delta > 0 ? "statUp" : "statDown");
        setReport(null);
        setStats((st) => ({ ...st, [id]: st[id] + delta }));
    };

    const confirm = () => {
        if (done) return;

        if (remaining > 0) {
            play("error");
            setReport({ unspent: remaining });

            return;
        }

        const trials = runTrials(stats);
        const failed = trials.filter((t) => t.failures.length);
        setReport({ trials });

        if (failed.length) {
            play("trialFail");
            say(`${failed.length} of ${trials.length} trials failed.`, "err");

            return;
        }

        play("trialPass");
        setDone(true);
        grantJournal("character-origin");
        complete();
    };

    const reset = () => {
        if (done) return;

        play("click");
        setReport(null);
        setStats(START);
    };

    return (
        <LevelFrame objective="Build a hero for three trials. Spend all 12 points.">
            <div className={s.layout}>
                <section className={s.sheet} aria-label="Character sheet">
                    <Hero stats={stats} />
                    <ul className={s.stats}>
                        {STATS.map((st) => (
                            <li key={st.id} className={s.row}>
                                <Rune id={st.id} />
                                <span className={s.name}>{st.name}</span>
                                <span className={s.pips} aria-hidden="true">
                                    {Array.from({ length: MAX }, (_, i) => (
                                        <i
                                            key={i}
                                            data-on={
                                                i < stats[st.id] || undefined
                                            }
                                        />
                                    ))}
                                </span>
                                <b
                                    className={cx(s.value, "tnum")}
                                    aria-live="polite"
                                >
                                    {stats[st.id]}
                                </b>
                                <button
                                    type="button"
                                    className={s.step}
                                    onClick={() => change(st.id, -1)}
                                    disabled={done || stats[st.id] <= MIN}
                                    aria-label={`Decrease ${st.name}`}
                                >
                                    -
                                </button>
                                <button
                                    type="button"
                                    className={s.step}
                                    onClick={() => change(st.id, 1)}
                                    disabled={
                                        done ||
                                        stats[st.id] >= MAX ||
                                        remaining <= 0
                                    }
                                    aria-label={`Increase ${st.name}`}
                                >
                                    +
                                </button>
                            </li>
                        ))}
                    </ul>
                    <p className={s.points}>
                        Points remaining{" "}
                        <b className={cx(s.pointsNo, "tnum")}>{remaining}</b>
                    </p>
                </section>

                <div className={s.info}>
                    {done || completed ? (
                        <CompletePanel
                            title="Character"
                            lines={COMPLETE_LINES}
                            shard={7}
                            onContinue={next}
                        />
                    ) : (
                        <>
                            <ul className={s.trials} aria-label="Trials">
                                {TRIALS.map((t) => {
                                    const result = report?.trials?.find(
                                        (r) => r.id === t.id,
                                    );
                                    const state = !result
                                        ? undefined
                                        : result.failures.length
                                          ? "fail"
                                          : "pass";
                                    return (
                                        <li
                                            key={t.id}
                                            className={s.trial}
                                            data-state={state}
                                        >
                                            <h3>{t.name}</h3>
                                            <p className={s.blurb}>{t.blurb}</p>
                                            {result && (
                                                <ul className={s.verdict}>
                                                    {result.failures.length ===
                                                    0 ? (
                                                        <li>Passed.</li>
                                                    ) : (
                                                        result.failures.map(
                                                            (m) => (
                                                                <li key={m}>
                                                                    {m}
                                                                </li>
                                                            ),
                                                        )
                                                    )}
                                                </ul>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>

                            {report?.unspent > 0 && (
                                <p className={s.warn} role="alert">
                                    Unspent points: {report.unspent}. Every
                                    point has to be spent.
                                </p>
                            )}

                            <div className={s.actions}>
                                <TerminalButton
                                    variant="primary"
                                    onClick={confirm}
                                    sound={null}
                                >
                                    Confirm build
                                </TerminalButton>
                                <TerminalButton
                                    onClick={reset}
                                    disabled={spent(stats) === 0}
                                >
                                    Reset
                                </TerminalButton>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </LevelFrame>
    );
}
