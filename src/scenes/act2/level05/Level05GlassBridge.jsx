import { useEffect, useRef, useState } from "react";
import { useSceneApi } from "@/game/hooks/useSceneApi";
import { useGameStore } from "@/store/gameStore";
import { grantAchievement, grantJournal } from "@/game/rewards";
import { play } from "@/audio/audioEngine";
import { cx } from "@/lib/cx";
import { TerminalWindow } from "@/ui/Terminal";
import TerminalButton from "@/ui/TerminalButton";
import CompletePanel from "@/ui/CompletePanel";
import LevelFrame from "@/ui/LevelFrame";
import { PAIRS, RULES, firstViolation } from "./bridge";
import s from "./level05.module.css";

const HP_COST_OF_A_FALL = 1;
const GLYPH_PAIR = 5;
const SHAFT = [0, 1, 2, 3, 4, 5, 6, 7];
const ROWS = Array.from({ length: PAIRS }, (_, i) => PAIRS - i);

const lines = (found) => [
    { text: "BRIDGE CROSSED", tone: "title" },
    { text: "Panels tested: 6" },
    { text: "Structural integrity: acceptable.", tone: "dim" },
    ...(found
        ? [
              { text: "", delay: 500 },
              {
                  text: "Unregistered texture: logged as anomaly.",
                  tone: "err",
                  glitch: true,
                  delay: 400,
              },
          ]
        : []),
];

function Etching({ found }) {
    return (
        <svg
            className={s.etch}
            data-found={found || undefined}
            viewBox="0 0 40 40"
            aria-hidden="true"
        >
            <path d="M20 4 36 20 20 36 4 20Z" />
            <path d="M20 12V28M13 20H20" />
            <path d="M26 8 31 13" />
        </svg>
    );
}

function Cracks() {
    return (
        <svg
            className={s.cracks}
            viewBox="0 0 100 40"
            preserveAspectRatio="none"
            aria-hidden="true"
        >
            <path d="M52 20 38 8 30 10 14 2M52 20 66 6 74 9 92 1M52 20 44 31 36 28 22 38M52 20 60 33 70 30 84 39M52 20 28 19 8 24M52 20 76 21 98 17" />
        </svg>
    );
}

export default function Level05GlassBridge() {
    const { completed, complete, damage, say, next } = useSceneApi(5);

    const foundBefore = useGameStore((st) =>
        st.achievements.includes("texture-not-found"),
    );

    const [picks, setPicks] = useState(() => Array(PAIRS).fill(null)); // 'L' | 'R' | null
    const [mode, setMode] = useState(completed ? "won" : "idle"); // idle | broken | crossing | won
    const [violated, setViolated] = useState(null);
    const [crossed, setCrossed] = useState(0);

    const timers = useRef([]);

    const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));

    useEffect(() => () => timers.current.forEach(clearTimeout), []);

    const busy = mode === "broken" || mode === "crossing" || mode === "won";
    const ready = picks.every(Boolean);

    const choose = (pair, side) => {
        if (busy) return;

        play("glassTap", { side });
        setViolated(null);
        setPicks((p) => p.map((v, i) => (i === pair - 1 ? side : v)));
    };

    const reset = () => {
        if (busy) return;

        play("paper");
        setViolated(null);
        setPicks(Array(PAIRS).fill(null));
    };

    const cross = () => {
        if (busy || !ready) return;

        const broken = firstViolation(picks);
        if (broken) {
            setViolated(broken);
            setMode("broken");
            play("glassCrack");
            say(`CONSTRAINT VIOLATED: ${broken.text}`, "err");
            damage();
            later(() => setMode("idle"), 1300);

            return;
        }

        setMode("crossing");
        setCrossed(0);

        picks.forEach((_, i) =>
            later(
                () => {
                    setCrossed(i + 1);
                    play("glassStep", { index: i });
                },

                350 + i * 320,
            ),
        );

        later(
            () => {
                setMode("won");
                complete();
            },

            350 + PAIRS * 320 + 250,
        );
    };

    const findTexture = (e) => {
        e.stopPropagation();
        play("anomaly");
        say("UNREGISTERED TEXTURE", "err");
        grantJournal("unregistered-texture");
        grantAchievement("texture-not-found");
    };

    const panelState = (pair, side) => {
        if (picks[pair - 1] !== side) return undefined;

        if (mode === "broken" && violated?.panels.includes(pair)) return "bad";

        if ((mode === "crossing" || mode === "won") && pair <= crossed)
            return "crossed";

        return "chosen";
    };

    return (
        <LevelFrame objective="Cross the bridge. Each pair has one safe panel. Every rule must hold.">
            <div className={s.layout}>
                <section className={s.arena} aria-label="Glass bridge">
                    <div className={s.abyss} aria-hidden="true">
                        {SHAFT.map((k) => (
                            <i
                                key={k}
                                className={s.ring}
                                style={{ "--k": k }}
                            />
                        ))}
                        <i className={s.furnace} />
                        <i className={cx(s.haze, s.hazeA)} />
                        <i className={cx(s.haze, s.hazeB)} />
                        <i className={s.lights} />
                    </div>
                    <div
                        className={s.bridge}
                        data-broken={mode === "broken" || undefined}
                    >
                        <div className={s.platform}>Exit</div>
                        {ROWS.map((pair) => (
                            <div
                                key={pair}
                                className={s.pair}
                                role="group"
                                aria-label={`Panel pair ${pair}`}
                            >
                                {["L", "R"].map((side) => (
                                    <div key={side} className={s.cell}>
                                        <button
                                            type="button"
                                            className={s.panel}
                                            data-state={panelState(pair, side)}
                                            aria-pressed={
                                                picks[pair - 1] === side
                                            }
                                            aria-label={`Pair ${pair}, ${side === "L" ? "left" : "right"} panel`}
                                            onClick={() => choose(pair, side)}
                                        >
                                            {pair === GLYPH_PAIR &&
                                                side === "L" && (
                                                    <Etching
                                                        found={foundBefore}
                                                    />
                                                )}
                                            {panelState(pair, side) ===
                                                "bad" && <Cracks />}
                                            <span
                                                className={s.side}
                                                aria-hidden="true"
                                            >
                                                {side === "L"
                                                    ? "LEFT"
                                                    : "RIGHT"}
                                            </span>
                                        </button>
                                        {pair === GLYPH_PAIR &&
                                            side === "L" && (
                                                <button
                                                    type="button"
                                                    className={s.glyphHit}
                                                    onClick={findTexture}
                                                    aria-label="Unregistered texture"
                                                />
                                            )}
                                    </div>
                                ))}
                                <span
                                    className={cx(s.num, "tnum")}
                                    aria-hidden="true"
                                >
                                    {String(pair).padStart(2, "0")}
                                </span>
                            </div>
                        ))}
                        <div className={s.platform}>Start</div>
                    </div>
                </section>

                <div className={s.info}>
                    {mode === "won" || completed ? (
                        <CompletePanel
                            title="Glass bridge"
                            lines={lines(foundBefore)}
                            shard={5}
                            onContinue={next}
                        />
                    ) : (
                        <>
                            <TerminalWindow title="Bridge inspection rules">
                                <ol className={s.rules}>
                                    {RULES.map((r, i) => (
                                        <li
                                            key={r.id}
                                            className={cx(
                                                s.rule,
                                                violated?.id === r.id &&
                                                    s.ruleBad,
                                            )}
                                        >
                                            <span
                                                className={cx(s.ruleNo, "tnum")}
                                            >
                                                {i + 1}
                                            </span>
                                            <span>{r.text}</span>
                                        </li>
                                    ))}
                                </ol>
                            </TerminalWindow>
                            <p className={s.text}>
                                {mode === "broken"
                                    ? `CONSTRAINT VIOLATED - ${violated?.text} The bridge cracks: -${HP_COST_OF_A_FALL} HP.`
                                    : "Pick one panel in every pair, then cross. A wrong crossing costs 1 HP. Hints are free."}
                            </p>
                            <div className={s.actions}>
                                <TerminalButton
                                    variant="primary"
                                    onClick={cross}
                                    disabled={!ready || busy}
                                    sound={null}
                                >
                                    Cross bridge
                                </TerminalButton>
                                <TerminalButton
                                    onClick={reset}
                                    disabled={busy || picks.every((p) => !p)}
                                    sound={null}
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
