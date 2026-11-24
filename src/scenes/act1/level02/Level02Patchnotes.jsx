import { useState } from "react";
import { useSceneApi } from "@/game/hooks/useSceneApi";
import { grantJournal } from "@/game/rewards";
import { play } from "@/audio/audioEngine";
import { TerminalWindow } from "@/ui/Terminal";
import { TerminalField } from "@/ui/TerminalField";
import TerminalButton from "@/ui/TerminalButton";
import CompletePanel from "@/ui/CompletePanel";
import LevelFrame from "@/ui/LevelFrame";
import s from "./level02.module.css";

const ENTRIES = [
    "Радикально ускорено поглаживание кошек",
    "Еще повышено качество снеков",
    "Софа: исправлены коллизии",
    "Пофикшен баг с красным светом",
    "Ассортимент кошек расширен",
    "В баланс оружия изменения не вносились",
    "Новых багов не найдено (надеемся)",
];

const ANSWER = "RESPAWN";
const ANSWER_RU = "РЕСПАВН";

const COMPLETE_LINES = [
    { text: "ОБНОВЛЕНИЕ ПРИМЕНЕНО", tone: "title" },
    { text: "Модуль RESPAWN разблокирован." },
    { text: "", delay: 250 },
    { text: "ИЗВЕСТНАЯ ПРОБЛЕМА:", tone: "err", delay: 700 },
    { text: "Система помнит игрока, который никогда не входил в систему." },
    { text: "Статус: не решена.", tone: "dim" },
];

export default function Level02Patchnotes() {
    const { completed, complete, damage, say, next } = useSceneApi(2);

    const [value, setValue] = useState("");
    const [error, setError] = useState("");

    const submit = (e) => {
        e.preventDefault();

        const answer = value.trim().toUpperCase();

        if (answer === ANSWER || answer === ANSWER_RU) {
            grantJournal("known-issue");
            complete();
        } else {
            setError(
                "ОБНОВЛЕНИЕ ОТКЛОНЕНО: неизвестное ключевое слово восстановления.",
            );
            damage();
            say("За неверное ключевое слово списывается 1 HP.", "dim");
            play("error");
        }
    };

    return (
        <LevelFrame objective="В этом журнале обновлений не просто журнал обновлений. Найдите ключевое слово восстановления.">
            <div className={s.layout}>
                <section className={s.window} aria-label="Журнал обновлений">
                    <div className={s.bar}>
                        <span>Журнал обновлений - сборка 02.1.2</span>
                        <span className={s.ver}>v1.2.0</span>
                    </div>
                    <div className={s.content}>
                        <h2 className={s.heading}>Патчноуты</h2>
                        <p className={s.sub}>
                            Изменения с прошлой внутренней сборки:
                        </p>
                        <ul className={s.entries}>
                            {ENTRIES.map((line) => (
                                <li key={line}>{line}</li>
                            ))}
                        </ul>
                    </div>
                    <p className={s.status}>
                        Обновление готово · ожидается ключевое слово
                        восстановления
                    </p>
                </section>

                <aside>
                    {completed ? (
                        <CompletePanel
                            title="Обновление"
                            lines={COMPLETE_LINES}
                            shard={2}
                            onContinue={next}
                        />
                    ) : (
                        <TerminalWindow title="Применить обновление">
                            <form
                                className={s.form}
                                onSubmit={submit}
                                noValidate
                            >
                                <TerminalField
                                    label="Ключевое слово восстановления"
                                    helper="Только буквы. Неверное ключевое слово стоит 1 HP."
                                    value={value}
                                    onChange={(e) => {
                                        setValue(e.target.value);
                                        setError("");
                                    }}
                                    error={error}
                                    autoFocus
                                />
                                <TerminalButton
                                    variant="primary"
                                    type="submit"
                                    sound={null}
                                >
                                    Применить обновление
                                </TerminalButton>
                            </form>
                        </TerminalWindow>
                    )}
                </aside>
            </div>
        </LevelFrame>
    );
}
