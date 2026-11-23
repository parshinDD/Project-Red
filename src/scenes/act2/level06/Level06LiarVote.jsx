import { useState } from "react";
import { useSceneApi } from "@/game/hooks/useSceneApi";
import { grantJournal } from "@/game/rewards";
import { play } from "@/audio/audioEngine";
import { cx } from "@/lib/cx";
import { TerminalWindow } from "@/ui/Terminal";
import TerminalButton from "@/ui/TerminalButton";
import CompletePanel from "@/ui/CompletePanel";
import LevelFrame from "@/ui/LevelFrame";
import { SUSPECTS, ANSWER, firstContradiction } from "./suspects";
import s from "./level06.module.css";

const COMPLETE_LINES = [
    { text: "ВСЕ ЛЖЕЦЫ ВЫЯВЛЕНЫ", tone: "title" },
    { text: "ОТЧЕТ ПРИНЯТ" },
    { text: "", delay: 700 },
    { text: "ЗАЯВЛЕНИЕ СИСТЕМЫ:", tone: "dim", delay: 600 },
    {
        text: "Я НЕ УДАЛЯЛ НИКАКИХ ЗАПИСЕЙ.",
        tone: "err",
        glitch: true,
        delay: 600,
    },
];

export default function Level06LiarVote() {
    const { completed, complete, say, next } = useSceneApi(6);

    const [marked, setMarked] = useState([]);
    const [flag, setFlag] = useState(null);
    const [filed, setFiled] = useState(completed);

    const toggle = (id) => {
        if (filed) return;

        const on = !marked.includes(id);
        play(on ? "stamp" : "unstamp");
        setFlag(null);
        setMarked((m) => (on ? [...m, id] : m.filter((x) => x !== id)));
    };

    const submit = () => {
        if (filed || marked.length === 0) return;

        const bad = firstContradiction(marked);

        if (bad) {
            setFlag(bad.id);
            play("error");
            say(
                `ОТЧЕТ ОТКЛОНЕН: показание подозреваемого ${bad.id} не согласуется с отмеченным набором. HP не списывается.`,
                "err",
            );

            return;
        }

        setFiled(true);
        grantJournal("system-statement");
        complete();
    };

    const solved = filed || completed;
    const shown = solved ? ANSWER : marked;

    return (
        <LevelFrame objective="Отметьте каждого лжеца. Высказывание лжеца всегда ложно. Все остальные говорят правду.">
            <div className={s.layout}>
                <section className={s.folder} aria-label="Досье подозреваемых">
                    <ul className={s.files}>
                        {SUSPECTS.map((p) => {
                            const liar = shown.includes(p.id);
                            return (
                                <li
                                    key={p.id}
                                    className={cx(
                                        s.file,
                                        liar && s.liar,
                                        flag === p.id && s.flag,
                                    )}
                                >
                                    <header className={s.tab}>
                                        <span>ДЕЛО</span>
                                        <b className={s.id}>{p.id}</b>
                                    </header>
                                    <div className={s.photo} aria-hidden="true">
                                        <i />
                                    </div>
                                    <blockquote className={s.says}>
                                        <span className={s.label}>
                                            Показание
                                        </span>
                                        "{p.says}"
                                    </blockquote>
                                    <button
                                        type="button"
                                        className={s.mark}
                                        aria-pressed={liar}
                                        disabled={solved}
                                        onClick={() => toggle(p.id)}
                                    >
                                        {liar
                                            ? "Отмечен как лжец"
                                            : "Отметить как лжеца"}
                                    </button>
                                    <span
                                        className={s.stamp}
                                        aria-hidden="true"
                                    >
                                        ЛЖЕЦ
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                </section>

                <div className={s.info}>
                    {solved ? (
                        <CompletePanel
                            title="Отчет"
                            lines={COMPLETE_LINES}
                            shard={6}
                            onContinue={next}
                        />
                    ) : (
                        <>
                            <TerminalWindow title="Отчет голосования">
                                <p className={s.text}>
                                    Отмечены как лжецы:{" "}
                                    <b className={s.count}>
                                        {marked.length
                                            ? [...marked].sort().join(", ")
                                            : "никто"}
                                    </b>
                                </p>
                                <p className={s.text}>
                                    {flag
                                        ? `ОТЧЕТ ОТКЛОНЕН - показание подозреваемого ${flag} не согласуется с отмеченным набором.`
                                        : "Ошибочные отчеты ничего не стоят."}
                                </p>
                            </TerminalWindow>
                            <div className={s.actions}>
                                <TerminalButton
                                    variant="primary"
                                    onClick={submit}
                                    disabled={marked.length === 0}
                                    sound={null}
                                >
                                    Подать отчет
                                </TerminalButton>
                                <TerminalButton
                                    onClick={() => {
                                        play("paper");
                                        setMarked([]);
                                        setFlag(null);
                                    }}
                                    disabled={marked.length === 0}
                                >
                                    Очистить
                                </TerminalButton>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </LevelFrame>
    );
}
