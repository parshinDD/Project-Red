import { useEffect, useRef, useState } from "react";
import { useSceneApi } from "@/game/hooks/useSceneApi";
import { navigate } from "@/game/flow/navigator";
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
    { k: "text", text: "СИГНАЛ ПОДТВЕРЖДЕН", tone: "title", delay: 300 },
    { k: "gap", delay: 100 },
    { k: "text", text: `Расшифрованная нагрузка: ${COMMAND}`, delay: 450 },
    { k: "text", text: "Источник: НЕ УСТАНОВЛЕН", tone: "dim", delay: 450 },
    {
        k: "text",
        text: "Система узнает эту сигнатуру.",
        tone: "dim",
        delay: 700,
    },
    {
        k: "text",
        text: "Система отказывается пояснять.",
        tone: "err",
        delay: 700,
    },
];

const ACCEPTED = [
    { text: "КОМАНДА ПРИНЯТА", tone: "title" },
    { text: "" },
    { text: "Все необходимые фрагменты проверены.", delay: 450 },
    { text: "" },
    { text: "BUILD_02-12", tone: "dim", delay: 400 },
    {
        text: "ФИНАЛЬНОЕ ВОССТАНОВЛЕНИЕ ГОТОВО",
        tone: "err",
        glitch: true,
        delay: 500,
    },
];

const BARS = 28;

export default function Level12Signal() {
    const { completed, complete, damage, say } = useSceneApi(12);

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
            damage();
            setNote(
                "НЕСОВПАДЕНИЕ СИГНАЛА: переданное слово не восстановлено. Списан 1 HP.",
            );
            say("Неверный ввод стоит 1 HP.", "dim");
        }
    };

    const finishRecovery = () => {
        complete();
        navigate("final.assembly");
    };

    return (
        <LevelFrame objective="Восстановите переданное слово.">
            <div className={s.layout}>
                {stage === "signal" && !completed && (
                    <>
                        <section
                            className={s.panel}
                            aria-label="Входящая передача"
                        >
                            <header className={s.head}>
                                <span className={s.live} aria-hidden="true" />
                                <span>ВХОДЯЩАЯ ПЕРЕДАЧА</span>
                            </header>

                            <dl className={s.meta}>
                                <div>
                                    <dt>Источник</dt>
                                    <dd>НЕИЗВЕСТЕН</dd>
                                </div>
                                <div>
                                    <dt>Формат</dt>
                                    <dd>MORSE</dd>
                                </div>
                                <div>
                                    <dt>Целостность сигнала</dt>
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
                                Сигнал можно прослушать повторно.
                                <br />
                                Визуальное декодирование недоступно.
                            </p>

                            <div className={s.actions}>
                                <TerminalButton
                                    variant="primary"
                                    onClick={replay}
                                    disabled={playing}
                                    sound={null}
                                >
                                    {playing
                                        ? "▮▮ Воспроизведение..."
                                        : heard
                                          ? "▶ Повторить сигнал"
                                          : "▶ Прослушать сигнал"}
                                </TerminalButton>
                            </div>
                        </section>

                        <section className={s.answer}>
                            <TerminalField
                                label="Переданное слово"
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
                                Расшифровать
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
                        <TerminalWindow title="Сигнал">
                            <TypedBlock
                                items={VERIFIED}
                                onDone={() => setVerifiedDone(true)}
                            />
                        </TerminalWindow>
                        {verifiedDone && (
                            <div className={s.actions}>
                                <TerminalButton
                                    variant="primary"
                                    onClick={() => setStage("reboot")}
                                >
                                    Продолжить
                                </TerminalButton>
                            </div>
                        )}
                    </>
                )}

                {stage === "reboot" && (
                    <RebootSequence onDone={finishRecovery} />
                )}

                {(stage === "done" || completed) && (
                    <CompletePanel
                        title="Восстановление"
                        lines={ACCEPTED}
                        shard={12}
                        onContinue={() => navigate("final.assembly")}
                    />
                )}
            </div>
        </LevelFrame>
    );
}
