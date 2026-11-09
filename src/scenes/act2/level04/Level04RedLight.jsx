import { useEffect, useRef, useState } from "react";
import { useSceneApi } from "@/game/hooks/useSceneApi";
import { useUiStore } from "@/store/uiStore";
import { grantJournal } from "@/game/rewards";
import { createMusic, play } from "@/audio/audioEngine";
import { cx } from "@/lib/cx";
import TerminalButton from "@/ui/TerminalButton";
import CompletePanel from "@/ui/CompletePanel";
import LevelFrame from "@/ui/LevelFrame";
import s from "./level04.module.css";

const GOAL = 100;
const LIMIT_S = 40;
const STEP_MS = 150;
const GRACE_MS = 270;
const GREEN_MS = [1300, 2600];
const RED_MS = [1000, 1800];
const DECOY_FROM_PHASE = 3;
const DECOY_CHANCE = 0.35;
const DECOY_GAP_MS = 8000;
const EARLY_STOP_MS = [450, 950];
const LATE_STOP_MS = [500, 1100];
const LATE_FULL_CHANCE = 0.25;
const MARKS = Array.from({ length: GOAL / 10 + 1 }, (_, i) => i * 10);
const PAD = 20;
const MINI = Array.from({ length: 20 }, (_, i) => (i + 1) * 5);

const COMPLETE_LINES = [
    { text: "REACTION TEST COMPLETE", tone: "title" },
    { text: "Distance: 100/100 steps" },
    { text: "", delay: 700 },
    {
        text: "Anomaly detected: Signal origin unknown.",
        tone: "err",
        glitch: true,
        delay: 500,
    },
];

const rand = ([a, b]) => a + Math.random() * (b - a);

const fresh = () => ({
    light: "green",
    phaseEnd: 0,
    holding: false,
    steps: 0,
    acc: 0,
    caught: false,
    redSince: 0,
    startedAt: 0,
    last: 0,
    graceUntil: 0,
    phase: 1,
    decoy: null,
    musicCutAt: 0,
    lastDecoyAt: -1e9,
    frozen: false,
    musicWas: false,
});

function Runner({ moving, caught }) {
    return (
        <svg
            className={s.runner}
            viewBox="0 0 40 72"
            data-moving={moving || undefined}
            data-caught={caught || undefined}
            aria-hidden="true"
        >
            <ellipse className={s.shadow} cx="20" cy="70.5" rx="11" ry="1.6" />
            <g className={s.legA}>
                <path d="M20 42V55" />
                <g className={s.shinA}>
                    <path d="M20 55V67H25" />
                </g>
            </g>
            <g className={s.armB}>
                <path d="M20 22V31" />
                <g className={s.foreB}>
                    <path d="M20 31V40" />
                </g>
            </g>
            <g className={s.torso}>
                <circle cx="20" cy="10" r="7" className={s.head} />
                <path d="M20 17V42" />
            </g>
            <g className={s.legB}>
                <path d="M20 42V55" />
                <g className={s.shinB}>
                    <path d="M20 55V67H25" />
                </g>
            </g>
            <g className={s.armA}>
                <path d="M20 22V31" />
                <g className={s.foreA}>
                    <path d="M20 31V40" />
                </g>
            </g>
        </svg>
    );
}

export default function Level04RedLight() {
    const { completed, active, complete, damage, say, next } = useSceneApi(4);

    const [mode, setMode] = useState(completed ? "won" : "intro"); // intro | running | timeout | won
    const [view, setView] = useState({
        light: "green",
        steps: 0,
        left: LIMIT_S,
        caught: false,
    });
    const [holding, setHolding] = useState(false);

    const sim = useRef(fresh());
    const music = useRef(null);
    const modeRef = useRef(mode);

    modeRef.current = mode;

    const start = () => {
        const now = performance.now();
        sim.current = {
            ...fresh(),
            phaseEnd: now + 2000,
            startedAt: now,
            last: now,
        };

        music.current ??= createMusic("redLight");
        music.current.rewind();
        music.current.play(0.05);

        setView({ light: "green", steps: 0, left: LIMIT_S, caught: false });
        setHolding(false);
        setMode("running");
        play("lightGreen");
    };

    const hold = (on) => {
        const sm = sim.current;
        if (modeRef.current !== "running") return;

        if (on && !sm.holding) {
            if (sm.light === "green" && !sm.caught) sm.acc = STEP_MS;

            if (sm.light === "red") sm.graceUntil = 0;
        }

        sm.holding = on;
        setHolding(on);
    };

    useEffect(() => {
        if (mode !== "running" || !active) return undefined;

        const id = setInterval(() => {
            const sm = sim.current;
            const now = performance.now();
            const dt = now - sm.last;
            sm.last = now;

            const ui = useUiStore.getState();
            if (ui.journalOpen || ui.menuOpen || ui.vaultOpen) {
                if (!sm.frozen) {
                    sm.frozen = true;
                    sm.musicWas = Boolean(music.current?.playing);
                    music.current?.pause(0.05);
                }

                sm.startedAt += dt;
                sm.phaseEnd += dt;
                sm.redSince += dt;
                sm.graceUntil += dt;
                sm.holding = false;

                if (sm.musicCutAt) sm.musicCutAt += dt;
                setHolding(false);

                return;
            }

            if (sm.frozen) {
                sm.frozen = false;
                if (sm.musicWas) music.current?.play();
            }

            if (now >= sm.phaseEnd) {
                if (sm.light === "green") {
                    sm.light = "red";
                    sm.redSince = now;
                    sm.phaseEnd = now + rand(RED_MS);
                    sm.graceUntil = sm.holding ? now + GRACE_MS : 0;

                    const redLen = sm.phaseEnd - now;
                    if (sm.decoy === "late") {
                        sm.musicCutAt =
                            now +
                            (Math.random() < LATE_FULL_CHANCE
                                ? redLen - 150
                                : Math.min(rand(LATE_STOP_MS), redLen - 150));
                    } else {
                        music.current?.pause();
                        sm.musicCutAt = 0;
                    }

                    sm.decoy = null;
                    play("lightRed");
                } else {
                    sm.light = "green";
                    sm.caught = false;
                    sm.phaseEnd = now + rand(GREEN_MS);
                    sm.phase += 1;
                    sm.musicCutAt = 0;
                    music.current?.play();

                    const greenLen = sm.phaseEnd - now;

                    if (
                        sm.phase >= DECOY_FROM_PHASE &&
                        now - sm.lastDecoyAt > DECOY_GAP_MS &&
                        Math.random() < DECOY_CHANCE
                    ) {
                        sm.lastDecoyAt = now;
                        if (Math.random() < 0.5 && greenLen > 1700) {
                            sm.musicCutAt = sm.phaseEnd - rand(EARLY_STOP_MS);
                        } else {
                            sm.decoy = "late";
                        }
                    }

                    play("lightGreen");
                }
            }

            if (sm.musicCutAt && now >= sm.musicCutAt) {
                music.current?.pause();
                sm.musicCutAt = 0;
            }

            if (
                sm.holding &&
                sm.light === "red" &&
                !sm.caught &&
                now > sm.graceUntil
            ) {
                sm.caught = true;
                say("Movement detected during RED LIGHT.", "err");
                damage();
            }

            if (sm.holding && !sm.caught) {
                sm.acc += dt;

                while (sm.acc >= STEP_MS && sm.steps < GOAL) {
                    sm.acc -= STEP_MS;
                    sm.steps += 1;
                    play("step");
                }
            } else {
                sm.acc = 0;
            }

            const left = Math.max(0, LIMIT_S - (now - sm.startedAt) / 1000);
            setView((v) =>
                v.light === sm.light &&
                v.steps === sm.steps &&
                v.caught === sm.caught &&
                Math.abs(v.left - left) < 0.05
                    ? v
                    : {
                          light: sm.light,
                          steps: sm.steps,
                          left,
                          caught: sm.caught,
                      },
            );

            if (sm.steps >= GOAL) {
                music.current?.pause(0.15);
                setMode("won");
                grantJournal("signal-origin");
                complete();
            } else if (left <= 0) {
                sm.holding = false;
                setHolding(false);
                music.current?.pause(0.02);
                setMode("timeout");
                play("error");
                say(
                    "Time expired. No HP is lost: the test can be repeated.",
                    "dim",
                );
            }
        }, 40);

        return () => {
            clearInterval(id);
            music.current?.pause(0.05);
        };
    }, [mode, active]);

    useEffect(() => {
        const isMove = (e) => e.code === "Space" || e.code === "ArrowRight";

        const down = (e) => {
            if (modeRef.current !== "running" || !isMove(e)) return;

            e.preventDefault();
            if (!e.repeat) hold(true);
        };

        const up = (e) => {
            if (modeRef.current === "running" && isMove(e)) hold(false);
        };

        const release = () => hold(false);
        window.addEventListener("keydown", down);
        window.addEventListener("keyup", up);
        window.addEventListener("blur", release);

        return () => {
            window.removeEventListener("keydown", down);
            window.removeEventListener("keyup", up);
            window.removeEventListener("blur", release);
        };
    }, []);

    const { light, steps, left, caught } = view;
    const running = mode === "running";
    const lightText = !running
        ? "STANDBY"
        : caught
          ? "CAUGHT"
          : light === "green"
            ? "MOVE"
            : "STOP";

    return (
        <LevelFrame objective="Reach the finish line.">
            <div className={s.layout}>
                <section className={s.arena} aria-label="Reaction arena">
                    <div
                        className={s.tower}
                        data-light={running ? light : "off"}
                        data-caught={caught || undefined}
                    >
                        <i className={cx(s.lamp, s.lampRed)} />
                        <i className={cx(s.lamp, s.lampGreen)} />
                        <b className={s.word}>{lightText}</b>
                    </div>

                    <div
                        className={s.view}
                        style={{ "--steps": steps }}
                        data-caught={caught || undefined}
                        aria-hidden="true"
                    >
                        <div className={s.far} />
                        <div className={s.floor}>
                            <i
                                className={s.startLine}
                                style={{ "--at": PAD }}
                            />
                            {MARKS.map((n) => (
                                <i
                                    key={n}
                                    className={s.post}
                                    style={{ "--at": PAD + n }}
                                >
                                    <b className="tnum">{n}</b>
                                </i>
                            ))}
                            <i
                                className={s.gate}
                                style={{ "--at": PAD + GOAL }}
                            >
                                <b>FINISH</b>
                                <span />
                            </i>
                        </div>
                        <Runner
                            moving={holding && running && !caught}
                            caught={caught}
                        />
                    </div>

                    <div
                        className={s.mini}
                        role="img"
                        aria-label={`${steps} of ${GOAL} steps`}
                    >
                        {MINI.map((n) => (
                            <i key={n} data-on={steps >= n || undefined} />
                        ))}
                    </div>

                    <button
                        type="button"
                        className={s.hold}
                        data-holding={holding || undefined}
                        disabled={!running}
                        onPointerDown={(e) => {
                            e.currentTarget.setPointerCapture?.(e.pointerId);
                            hold(true);
                        }}
                        onPointerUp={() => hold(false)}
                        onPointerCancel={() => hold(false)}
                        aria-label="Hold to move. Keyboard: hold Space"
                    >
                        Hold to move <kbd>Space</kbd>
                    </button>
                    <p className="srOnly" aria-live="assertive">
                        {running
                            ? light === "red"
                                ? "Red light. Stop."
                                : "Green light. Move."
                            : ""}
                    </p>
                </section>

                <div className={s.info}>
                    <dl className={s.readout}>
                        <div>
                            <dt>Distance</dt>
                            <dd>
                                {steps}/{GOAL}
                            </dd>
                        </div>
                        <div>
                            <dt>Time</dt>
                            <dd>{left.toFixed(1)}s</dd>
                        </div>
                        <div>
                            <dt>Signal</dt>
                            <dd
                                className={cx(
                                    s.state,
                                    light === "red" && running && s.stateRed,
                                )}
                            >
                                {lightText}
                            </dd>
                        </div>
                    </dl>

                    {mode === "intro" && (
                        <>
                            <ul className={s.rules}>
                                <li>
                                    <b className={s.go}>GREEN LIGHT:</b> move
                                </li>
                                <li>
                                    <b className={s.stop}>RED LIGHT:</b> stop
                                </li>
                                <li>Time limit: {LIMIT_S} seconds</li>
                                <li>Required distance: {GOAL} steps</li>
                                <li>Moving on red: -1 HP</li>
                            </ul>
                            <div className={s.actions}>
                                <TerminalButton
                                    variant="primary"
                                    onClick={start}
                                    autoFocus
                                >
                                    Start test
                                </TerminalButton>
                            </div>
                        </>
                    )}

                    {mode === "timeout" && (
                        <>
                            <p className={s.text}>
                                TIME EXPIRED - {steps}/{GOAL} steps. The test
                                can be repeated at no cost.
                            </p>
                            <div className={s.actions}>
                                <TerminalButton
                                    variant="primary"
                                    onClick={start}
                                    autoFocus
                                >
                                    Repeat test
                                </TerminalButton>
                            </div>
                        </>
                    )}
                    {running && (
                        <p className={s.text}>
                            Hold SPACE or the button to move. Let go the moment
                            the light turns red.
                        </p>
                    )}
                    {(mode === "won" || completed) && (
                        <CompletePanel
                            title="Reaction test"
                            lines={COMPLETE_LINES}
                            shard={4}
                            onContinue={next}
                        />
                    )}
                </div>
            </div>
        </LevelFrame>
    );
}
