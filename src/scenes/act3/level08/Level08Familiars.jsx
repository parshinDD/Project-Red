import { useState } from "react";
import { useSceneApi } from "@/game/hooks/useSceneApi";
import { grantJournal } from "@/game/rewards";
import { play } from "@/audio/audioEngine";
import { cx } from "@/lib/cx";
import TerminalButton from "@/ui/TerminalButton";
import { TerminalField } from "@/ui/TerminalField";
import CompletePanel from "@/ui/CompletePanel";
import LevelFrame from "@/ui/LevelFrame";
import { ENTRIES, OBSERVATION, matches } from "./familiars";
import s from "./level08.module.css";

const COMPLETE_LINES = [
    { text: "ДАННЫЕ ФАМИЛЬЯРОВ ВОССТАНОВЛЕНЫ", tone: "title" },
    { text: "" },
    { text: "Запись 001: ELSA" },
    { text: "Запись 002: EMI" },
    { text: "Поведенческая классификация: ПОДТВЕРЖДЕНА", delay: 400 },
    { text: "", delay: 500 },
    { text: "Открыта запись архива:", tone: "dim", delay: 400 },
    {
        text: "ТО, ЧТО СТОИТ ПОМНИТЬ",
        tone: "err",
        glitch: true,
        delay: 500,
    },
];

function Paw() {
    return (
        <svg className={s.paw} viewBox="0 0 24 24" aria-hidden="true">
            <ellipse cx="12" cy="16.5" rx="5" ry="4" />
            <ellipse cx="5.5" cy="11" rx="2" ry="2.8" />
            <ellipse cx="9.5" cy="6.5" rx="2" ry="2.8" />
            <ellipse cx="14.5" cy="6.5" rx="2" ry="2.8" />
            <ellipse cx="18.5" cy="11" rx="2" ry="2.8" />
        </svg>
    );
}

function Damaged({ text }) {
    return text.split(/(▓+)/).map((part, i) =>
        part.startsWith("▓") ? (
            <span key={i} className={s.gap} aria-label="damaged">
                {part}
            </span>
        ) : (
            part
        ),
    );
}

export default function Level08Familiars() {
    const { completed, complete, say, next } = useSceneApi(8);

    const [stage, setStage] = useState(completed ? "done" : "match");
    const [picks, setPicks] = useState({ "001": "", "002": "" });
    const [observed, setObserved] = useState("");
    const [note, setNote] = useState("");

    const restore = () => {
        if (ENTRIES.every((e) => matches(picks[e.no], e.accepts))) {
            play("cardFlip");
            play("found");
            setNote("");
            setStage("observe");
            say(
                "Записи восстановлены. Открыта дополнительная запись.",
                "dim",
            );
        } else {
            play("error");
            setNote(
                "СБОЙ ВОССТАНОВЛЕНИЯ: как минимум одна запись сопоставлена не с тем фамильяром.",
            );
        }
    };

    const observe = () => {
        if (matches(observed, OBSERVATION.accepts)) {
            play("trialPass");
            setNote("");
            setStage("done");
            grantJournal("things-worth-remembering");
            complete();
        } else {
            play("error");
            setNote("ПРОВЕРКА НАБЛЮДАТЕЛЬНОСТИ ПРОВАЛЕНА: перечитайте записи.");
        }
    };

    return (
        <LevelFrame objective="Восстановите поврежденные записи базы фамильяров.">
            <div className={s.layout}>
                {stage !== "done" && !completed ? (
                    <>
                        <p className={s.banner}>
                            БАЗА ФАМИЛЬЯРОВ /{" "}
                            {stage === "match"
                                ? "ПОВРЕЖДЕННЫЕ ЗАПИСИ"
                                : "ДОПОЛНИТЕЛЬНАЯ ЗАПИСЬ"}
                        </p>

                        {stage === "match" && (
                            <>
                                <div className={s.pages}>
                                    {ENTRIES.map((e) => (
                                        <article key={e.no} className={s.page}>
                                            <Paw />
                                            <header className={s.head}>
                                                <span>Запись № {e.no}</span>
                                                <span
                                                    className={s.redacted}
                                                    aria-label="имя скрыто"
                                                >
                                                    ████████
                                                </span>
                                            </header>
                                            <p className={s.text}>
                                                «<Damaged text={e.text} />»
                                            </p>
                                            <p className={s.ask}>
                                                Кого описывает эта запись?
                                            </p>
                                            <TerminalField
                                                label="Имя фамильяра"
                                                value={picks[e.no]}
                                                onChange={(ev) => {
                                                    setNote("");
                                                    setPicks((p) => ({
                                                        ...p,
                                                        [e.no]: ev.target.value,
                                                    }));
                                                }}
                                                onKeyDown={(ev) => {
                                                    if (
                                                        ev.key === "Enter" &&
                                                        picks["001"].trim() &&
                                                        picks["002"].trim()
                                                    )
                                                        restore();
                                                }}
                                                maxLength={24}
                                            />
                                        </article>
                                    ))}
                                </div>
                                <div className={s.actions}>
                                    <TerminalButton
                                        variant="primary"
                                        onClick={restore}
                                        disabled={
                                            !picks["001"].trim() ||
                                            !picks["002"].trim()
                                        }
                                        sound={null}
                                    >
                                        Восстановить записи
                                    </TerminalButton>
                                </div>
                            </>
                        )}

                        {stage === "observe" && (
                            <>
                                <article className={cx(s.page, s.single)}>
                                    <Paw />
                                    <header className={s.head}>
                                        <span>Запись № 003</span>
                                        <span>Наблюдение</span>
                                    </header>
                                    <p className={s.text}>
                                        {OBSERVATION.lines.map((l) => (
                                            <span key={l} className={s.line}>
                                                {l}
                                            </span>
                                        ))}
                                    </p>
                                    <p className={s.ask}>
                                        {OBSERVATION.question}
                                    </p>
                                    <TerminalField
                                        label="Имя фамильяра"
                                        value={observed}
                                        onChange={(ev) => {
                                            setNote("");
                                            setObserved(ev.target.value);
                                        }}
                                        onKeyDown={(ev) => {
                                            if (ev.key === "Enter" && observed.trim())
                                                observe();
                                        }}
                                        maxLength={24}
                                    />
                                </article>
                                <div className={s.actions}>
                                    <TerminalButton
                                        variant="primary"
                                        onClick={observe}
                                        disabled={!observed.trim()}
                                        sound={null}
                                    >
                                        Подтвердить
                                    </TerminalButton>
                                </div>
                            </>
                        )}

                        {note && (
                            <p className={s.note} role="alert">
                                {note}
                            </p>
                        )}
                    </>
                ) : (
                    <CompletePanel
                        title="База фамильяров"
                        lines={COMPLETE_LINES}
                        shard={8}
                        onContinue={next}
                    />
                )}
            </div>
        </LevelFrame>
    );
}
