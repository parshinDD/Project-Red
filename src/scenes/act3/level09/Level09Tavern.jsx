import { useEffect, useId, useRef, useState } from "react";
import { useSceneApi } from "@/game/hooks/useSceneApi";
import { grantJournal } from "@/game/rewards";
import { createMusic, play } from "@/audio/audioEngine";
import { cx } from "@/lib/cx";
import { TerminalField } from "@/ui/TerminalField";
import TerminalButton from "@/ui/TerminalButton";
import CompletePanel from "@/ui/CompletePanel";
import LevelFrame from "@/ui/LevelFrame";
import { GREETING, NPCS, WRONG, check } from "./tavern";
import TavernArt from "./TavernArt";
import s from "./level09.module.css";

const COMPLETE_LINES = [
    { text: "ИНДЕКС ПАМЯТИ: СОБРАН", tone: "title" },
    { text: "" },
    { text: "Разработчик запросил этот тест.", delay: 300 },
    { text: "Разработчик запросил этот маршрут.", delay: 500 },
    { text: "Разработчик запросил, чтобы вы дошли до конца.", delay: 500 },
    { text: "", delay: 600 },
    { text: "ЛИЧНОСТЬ: СКРЫТА", tone: "err", glitch: true, delay: 500 },
];

export default function Level09Tavern() {
    const { completed, complete, say, next } = useSceneApi(9);
    const uid = useId();

    const [solved, setSolved] = useState(
        completed ? NPCS.map((n) => n.id) : [],
    );
    const [talk, setTalk] = useState(null);
    const [answer, setAnswer] = useState("");
    const [reply, setReply] = useState(null);
    const [finished, setFinished] = useState(completed);

    const timer = useRef(null);

    const npc = NPCS.find((n) => n.id === talk);
    const isSolved = (id) => solved.includes(id);

    useEffect(() => {
        const room = createMusic("tavern", { gain: 0.32 });
        room.play(1.2);

        return () => room.pause(0.4);
    }, []);

    useEffect(() => () => clearTimeout(timer.current), []);

    const visit = (id) => {
        play("mugClink");
        setTalk(id);
        setAnswer("");
        setReply(null);
    };

    const submit = () => {
        if (!npc || !answer.trim()) return;

        if (check(npc, answer)) {
            const next_ = [...solved, npc.id];

            setSolved(next_);
            setReply({ ok: true, lines: npc.thanks });
            play("memoryIndex");
            grantJournal(`memory-${npc.index}`);
            say(`ИНДЕКС ПАМЯТИ: 0${npc.index}`, "dim");

            if (next_.length === NPCS.length) {
                timer.current = setTimeout(() => {
                    setFinished(true);
                    grantJournal("developer-identity");
                    complete();
                }, 1800);
            }
        } else {
            play("error");
            setReply({
                ok: false,
                lines: [WRONG[Math.floor(Math.random() * WRONG.length)]],
            });
        }
    };

    return (
        <LevelFrame objective="Ответьте на три вопроса. Навещать их можно в любом порядке.">
            <div className={s.layout}>
                {finished ? (
                    <CompletePanel
                        title="Таверна"
                        lines={COMPLETE_LINES}
                        shard={9}
                        onContinue={next}
                    />
                ) : (
                    <>
                        <div className={s.scene}>
                            <TavernArt
                                id={uid.replace(/[^a-zA-Z0-9_-]/g, "")}
                            />
                            <i className={s.vignette} />
                            {NPCS.map((n) => (
                                <button
                                    key={n.id}
                                    type="button"
                                    className={s.npc}
                                    data-npc={n.id}
                                    data-on={talk === n.id || undefined}
                                    data-solved={isSolved(n.id) || undefined}
                                    onClick={() => visit(n.id)}
                                    aria-label={`Поговорить: ${n.name}${isSolved(n.id) ? " (отвечено)" : ""}`}
                                >
                                    <span className={s.mark} aria-hidden="true">
                                        {isSolved(n.id) ? "✓" : "?"}
                                    </span>
                                    <span className={s.tag} aria-hidden="true">
                                        {n.name}
                                    </span>
                                </button>
                            ))}
                        </div>

                        <div
                            className={s.index}
                            aria-label={`Индекс памяти: ${solved.length} из 3`}
                        >
                            <span>ИНДЕКС ПАМЯТИ</span>
                            {NPCS.map((n) => (
                                <b
                                    key={n.id}
                                    data-on={isSolved(n.id) || undefined}
                                    className="tnum"
                                >
                                    0{n.index}
                                </b>
                            ))}
                        </div>

                        <section className={s.dialog} aria-live="polite">
                            {!npc ? (
                                <div className={s.lines}>
                                    {GREETING.map((l, i) => (
                                        <p key={l} style={{ "--i": i }}>
                                            {l}
                                        </p>
                                    ))}
                                    <p
                                        className={s.hint}
                                        style={{ "--i": GREETING.length }}
                                    >
                                        Нажмите на персонажа, чтобы поговорить.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <h3 className={s.who}>{npc.name}</h3>
                                    <div className={s.lines} key={npc.id}>
                                        {npc.lines.map((l, i) => (
                                            <p key={l} style={{ "--i": i }}>
                                                {l}
                                            </p>
                                        ))}
                                    </div>
                                    {isSolved(npc.id) ? (
                                        <div
                                            className={cx(s.lines, s.answered)}
                                        >
                                            {(reply?.ok
                                                ? reply.lines
                                                : npc.thanks
                                            ).map((l) => (
                                                <p key={l}>{l}</p>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className={s.ask}>
                                            <TerminalField
                                                label="Ваш ответ"
                                                value={answer}
                                                onChange={(e) => {
                                                    setAnswer(e.target.value);
                                                    if (reply) setReply(null);
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter")
                                                        submit();
                                                }}
                                                error={
                                                    reply && !reply.ok
                                                        ? reply.lines[0]
                                                        : undefined
                                                }
                                                autoFocus
                                            />
                                            <TerminalButton
                                                variant="primary"
                                                onClick={submit}
                                                disabled={!answer.trim()}
                                                sound={null}
                                            >
                                                Ответить
                                            </TerminalButton>
                                        </div>
                                    )}
                                </>
                            )}
                        </section>
                    </>
                )}
            </div>
        </LevelFrame>
    );
}
