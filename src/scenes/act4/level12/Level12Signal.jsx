import { useEffect, useRef, useState } from "react";
import { useSceneApi } from "@/game/hooks/useSceneApi";
import { play } from "@/audio/audioEngine";
import { morseDuration } from "@/audio/soundsAct4";
import { TerminalWindow } from "@/ui/Terminal";
import TypedBlock from "@/ui/TypedBlock";
import TerminalButton from "@/ui/TerminalButton";
import { TerminalField } from "@/ui/TerminalField";
import CompletePanel from "@/ui/CompletePanel";
import LevelFrame from "@/ui/LevelFrame";
import RebootSequence from "./RebootSequence";
import { COMMAND, SIGNAL_TEXT, isSignal } from "./signal";
import s from "./level12.module.css";

const VERIFIED = [
    { k: "text", text: "SIGNAL VERIFIED", tone: "title", delay: 300 },
    { k: "gap", delay: 100 },
    { k: "text", text: `Payload decoded: ${COMMAND}`, delay: 450 },
    { k: "text", text: "Source: UNRESOLVED", tone: "dim", delay: 450 },
    {
        k: "text",
        text: "The system recognizes this signature.",
        tone: "dim",
        delay: 700,
    },
    {
        k: "text",
        text: "The system refuses to elaborate.",
        tone: "err",
        delay: 700,
    },
];

const ACCEPTED = [
    { text: "COMMAND ACCEPTED", tone: "title" },
    { text: "" },
    { text: "All required fragments verified.", delay: 450 },
    { text: "" },
    { text: "BUILD_02-12", tone: "dim", delay: 400 },
    { text: "FINAL RECOVERY READY", tone: "err", glitch: true, delay: 500 },
];

const BARS = 28;

export default function Level12Signal() {
    const { completed, complete, next } = useSceneApi(12);

    const [stage, setStage] = useState(completed ? "done" : "signal");
    const [playing, setPlaying] = useState(false);
    const [heard, setHeard] = useState(false);
    const [answer, setAnswer] = useState("");
    const [note, setNote] = useState("");
    const [verifiedDone, setVerifiedDone] = useState(false);

    const timer = useRef(null);

    const [bars] = useState(() =>
        Array.from({ length: BARS }, () => ({
            d: 0.35 + Math.random() * 0.7,
            o: -Math.random() * 1.2,
            h: 0.25 + Math.random() * 0.75,
        })),
    );

    useEffect(() => () => clearTimeout(timer.current), []);

    const replay = () => {
        if (playing) return;

        play("morse", { text: SIGNAL_TEXT });
        setPlaying(true);
        setHeard(true);
        timer.current = setTimeout(
            () => setPlaying(false),
            (morseDuration(SIGNAL_TEXT) + 0.7) * 1000,
        );
    };

    const submit = () => {
        if (!answer.trim()) return;

        if (isSignal(answer)) {
            play("trialPass");
            setNote("");
            setStage("verified");
        } else {
            play("error");
            setNote("SIGNAL MISMATCH: the transmitted word was not recovered.");
        }
    };

    const finish = () => {
        complete();
        next();
    };

    return (
        <LevelFrame objective="Recover the transmitted word.">
            <div className={s.layout}>
                {stage === "signal" && (
                    <>
                        <section
                            className={s.panel}
                            aria-label="Incoming transmission"
                        >
                            <header className={s.head}>
                                <span className={s.live} aria-hidden="true" />
                                <span>INCOMING TRANSMISSION</span>
                            </header>

                            <dl className={s.meta}>
                                <div>
                                    <dt>Source</dt>
                                    <dd>UNKNOWN</dd>
                                </div>
                                <div>
                                    <dt>Format</dt>
                                    <dd>MORSE</dd>
                                </div>
                                <div>
                                    <dt>Signal integrity</dt>
                                    <dd className="tnum">87%</dd>
                                </div>
                            </dl>

                            <div
                                className={s.noise}
                                data-on={playing || undefined}
                                aria-hidden="true"
                            >
                                {bars.map((b, i) => (
                                    <i
                                        key={i}
                                        style={{
                                            "--d": `${b.d}s`,
                                            "--o": `${b.o}s`,
                                            "--h": b.h,
                                        }}
                                    />
                                ))}
                            </div>

                            <p className={s.status}>
                                The signal can be replayed.
                                <br />
                                Visual decoding is unavailable.
                            </p>

                            <div className={s.actions}>
                                <TerminalButton
                                    variant="primary"
                                    onClick={replay}
                                    disabled={playing}
                                    sound={null}
                                >
                                    {playing
                                        ? "▮▮ Playing..."
                                        : heard
                                          ? "▶ Replay signal"
                                          : "▶ Play signal"}
                                </TerminalButton>
                            </div>
                        </section>

                        <section className={s.answer}>
                            <TerminalField
                                label="Transmitted word"
                                value={answer}
                                onChange={(e) => {
                                    setNote("");
                                    setAnswer(e.target.value);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") submit();
                                }}
                                maxLength={12}
                            />
                            <TerminalButton
                                variant="primary"
                                onClick={submit}
                                disabled={!answer.trim()}
                                sound={null}
                            >
                                Decode
                            </TerminalButton>
                        </section>

                        {note && (
                            <p className={s.note} role="alert">
                                {note}
                            </p>
                        )}
                    </>
                )}

                {stage === "verified" && (
                    <>
                        <TerminalWindow title="Signal">
                            <TypedBlock
                                items={VERIFIED}
                                onDone={() => setVerifiedDone(true)}
                            />
                        </TerminalWindow>
                        {verifiedDone && (
                            <div className={s.actions}>
                                <TerminalButton
                                    variant="primary"
                                    onClick={() => setStage("command")}
                                >
                                    Continue
                                </TerminalButton>
                            </div>
                        )}
                    </>
                )}

                {stage === "command" && <RebootSequence onDone={finish} />}

                {stage === "done" && (
                    <CompletePanel
                        title="Recovery"
                        lines={ACCEPTED}
                        shard={12}
                        onContinue={next}
                    />
                )}
            </div>
        </LevelFrame>
    );
}
