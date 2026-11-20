import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { getAudioNodes, play, setAudioDecay } from "@/audio/audioEngine";
import { createDrone } from "@/audio/soundsAct4";
import { fireGlitch, setLagBlocked } from "@/game/hooks/useDecay";
import { useUiStore } from "@/store/uiStore";
import { COMMAND } from "./signal";
import s from "./reboot.module.css";

export const TIMELINE = {
    letters: [1800, 4400, 7000],
    swell: 8400,
    cut: 17600,
    black: 1500,
    bootStep: 340,
    hold: 1500,
};

const BOOT = [
    "SYSTEM RESTART",
    "MEMORY CHECK .......... OK",
    "FRAGMENTS ............. 12 / 12",
    "BUILD_02-12 ........... LOADED",
    "ALL SYSTEMS NOMINAL",
];

const pad2 = (n) => String(n).padStart(2, "0");
const lerp = (a, b, t) => a + (b - a) * t;
const NOISE = "▒░▓█/\\|_-:0123456789ABCDEF ";

const noiseLine = () =>
    Array.from(
        { length: 26 + Math.floor(Math.random() * 20) },
        () => NOISE[Math.floor(Math.random() * NOISE.length)],
    ).join("");

export default function RebootSequence({ onDone }) {
    const [phase, setPhase] = useState("run"); // run | black | boot
    const [shown, setShown] = useState(0);
    const [logs, setLogs] = useState([]);
    const [boot, setBoot] = useState([]);

    const stageRef = useRef(null);
    const fxRef = useRef(null);
    const doneRef = useRef(onDone);

    doneRef.current = onDone;

    useEffect(() => {
        const timers = [];
        const at = (ms, fn) => timers.push(setTimeout(fn, ms));
        const reduce = window.matchMedia?.(
            "(prefers-reduced-motion: reduce)",
        ).matches;

        setAudioDecay(0);
        setLagBlocked(true);

        const nodes = getAudioNodes();
        const drone = nodes ? createDrone(nodes) : null;
        const t0 = performance.now();
        const span = TIMELINE.cut - TIMELINE.swell;
        let raf = 0;
        let lastLevel = 0;
        let cutDone = false;

        const kAt = (t) =>
            t < TIMELINE.swell
                ? 0.05 + 0.22 * (t / TIMELINE.swell)
                : 0.27 +
                  0.73 *
                      Math.pow(Math.min(1, (t - TIMELINE.swell) / span), 1.35);

        const frame = () => {
            const t = performance.now() - t0;
            const k = Math.min(1, kAt(t));

            fxRef.current?.style.setProperty("--k", k.toFixed(3));
            stageRef.current?.style.setProperty("--k", k.toFixed(3));

            if (t - lastLevel > 110) {
                lastLevel = t;
                drone?.level(k);
            }

            if (!reduce && stageRef.current) {
                const amp = Math.max(0, (k - 0.3) / 0.7);

                stageRef.current.style.transform = amp
                    ? `translate(${((Math.random() - 0.5) * amp * 12).toFixed(1)}px, ${(
                          (Math.random() - 0.5) *
                          amp *
                          7
                      ).toFixed(1)}px)`
                    : "";
            }

            if (!cutDone) raf = requestAnimationFrame(frame);
        };

        raf = requestAnimationFrame(frame);

        TIMELINE.letters.forEach((ms, i) =>
            at(ms, () => {
                setShown(i + 1);
                play("keyTap");
            }),
        );

        const glitchLoop = () => {
            const p = Math.min(
                1,
                (performance.now() - t0 - TIMELINE.swell) / span,
            );

            fireGlitch("idle");

            timers.push(
                setTimeout(glitchLoop, lerp(1000, 220, Math.max(0, p))),
            );
        };

        at(TIMELINE.swell, glitchLoop);

        let tl = TIMELINE.swell + 300;

        for (let i = 1; i <= 12; i++) {
            const n = i;

            at(tl, () =>
                setLogs((cur) =>
                    [
                        ...cur,
                        { t: `VERIFY FRAGMENT ${pad2(n)} / 12 ........ OK` },
                    ].slice(-16),
                ),
            );

            tl += 650 * Math.pow(0.78, i - 1) + 110;
        }

        [
            ["ALL REQUIRED FRAGMENTS VERIFIED", false],
            ["BUILD_02-12", false],
            ["FINAL RECOVERY READY", true],
        ].forEach(([text, hot]) => {
            tl += 320;
            at(tl, () =>
                setLogs((cur) => [...cur, { t: text, hot }].slice(-16)),
            );
        });

        for (let ms = tl + 300; ms < TIMELINE.cut - 100; ms += 85)
            at(ms, () =>
                setLogs((cur) =>
                    [...cur, { t: noiseLine(), noise: true }].slice(-16),
                ),
            );

        at(TIMELINE.cut, () => {
            cutDone = true;
            cancelAnimationFrame(raf);
            drone?.cut();

            const ui = useUiStore.getState();

            ui.setGlitch(null);
            ui.setLag(null);
            ui.setDecay(0);
            setPhase("black");
        });

        const bootAt = TIMELINE.cut + TIMELINE.black;

        at(bootAt, () => setPhase("boot"));
        BOOT.forEach((line, i) => {
            at(bootAt + 250 + i * TIMELINE.bootStep, () => {
                setBoot((cur) => [...cur, line]);

                if (i === BOOT.length - 1) play("bootChime");
            });
        });

        at(bootAt + 250 + BOOT.length * TIMELINE.bootStep + TIMELINE.hold, () =>
            doneRef.current?.(),
        );

        return () => {
            cutDone = true;
            cancelAnimationFrame(raf);
            timers.forEach(clearTimeout);
            drone?.cut();

            setLagBlocked(false);
        };
    }, []);

    const status =
        shown === 0
            ? "AWAITING COMMAND"
            : shown < COMMAND.length
              ? "RECEIVING"
              : "COMMAND RECEIVED";

    return (
        <>
            <section
                ref={stageRef}
                className={s.stage}
                aria-label="Recovery command"
            >
                <header className={s.head}>
                    <span className={s.live} aria-hidden="true" />
                    <span>RECOVERY COMMAND REQUIRED</span>
                </header>

                <p className={s.status} aria-live="polite">
                    {status}
                </p>

                <div
                    className={s.word}
                    aria-label={`Command: ${COMMAND.slice(0, shown)}`}
                >
                    {Array.from(COMMAND).map((ch, i) => (
                        <span
                            key={i}
                            className={s.cell}
                            data-on={i < shown || undefined}
                            data-next={i === shown || undefined}
                        >
                            {i < shown ? ch : ""}
                        </span>
                    ))}
                </div>

                <div className={s.log} aria-hidden="true">
                    {logs.map((l, i) => (
                        <p
                            key={`${i}:${l.t}`}
                            data-noise={l.noise || undefined}
                            data-hot={l.hot || undefined}
                        >
                            {l.t}
                        </p>
                    ))}
                </div>
            </section>

            {createPortal(
                <div
                    ref={fxRef}
                    className={s.fx}
                    data-phase={phase}
                    aria-hidden="true"
                >
                    <i className={s.wash} />
                    <i className={s.vignette} />
                    <div className={s.boot}>
                        {boot.map((l) => (
                            <p key={l}>{l}</p>
                        ))}
                    </div>
                </div>,
                document.body,
            )}
        </>
    );
}
