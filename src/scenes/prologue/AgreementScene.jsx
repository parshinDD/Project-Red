import { useState } from "react";
import { TerminalWindow } from "@/ui/Terminal";
import TypedBlock from "@/ui/TypedBlock";
import { TerminalField, TerminalCheckbox } from "@/ui/TerminalField";
import TerminalButton from "@/ui/TerminalButton";
import { useGameStore } from "@/store/gameStore";
import { useUiStore } from "@/store/uiStore";
import { navigate } from "@/game/flow/navigator";
import { grantAchievement, grantJournal } from "@/game/rewards";
import { REQUIRED_PLAYER_ID } from "@/game/constants";
import { play } from "@/audio/audioEngine";
import s from "./prologue.module.css";

const TERMS = [
    {
        k: "text",
        as: "h1",
        text: "ТЕСТОВОЕ СОГЛАШЕНИЕ ИГРОКА",
        tone: "title",
        delay: 500,
    },
    { k: "gap", delay: 120 },
    {
        k: "text",
        text: "Продолжая, вы соглашаетесь протестировать экспериментальную сборку.",
        delay: 200,
    },
    { k: "gap", delay: 120 },
    {
        k: "text",
        text: "Тест может включать головоломки, проверки памяти, визуальные аномалии и несколько сомнительных проектных решений.",
        delay: 200,
    },
    { k: "gap", delay: 120 },
    {
        k: "text",
        text: "Прогресс сохраняется локально.",
        delay: 200,
    },
    { k: "gap", delay: 120 },
    {
        k: "text",
        text: "Разработчик не несет ответственности за необычно настойчивых кошек, подозрительные патчноуты и неожиданные награды.",
        delay: 200,
    },
];

export default function AgreementScene() {
    const [typed, setTyped] = useState(false);
    const [playerId, setPlayerId] = useState("");
    const [read, setRead] = useState(false);
    const [errors, setErrors] = useState({});
    const [idFails, setIdFails] = useState(0);
    const [clauseOpen, setClauseOpen] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        const next = {};
        const idOk = playerId.trim().toLowerCase() === REQUIRED_PLAYER_ID;

        if (!idOk) {
            next.id =
                idFails >= 2
                    ? "PLAYER ID отклонен. Запись в реестре: ID - одно слово из четырех латинских букв в нижнем регистре."
                    : "PLAYER ID не найден в реестре получателей.";
            setIdFails((n) => n + 1);
        }

        if (!read) next.read = "Требуется подтверждение.";

        setErrors(next);
        if (Object.keys(next).length) {
            play("error");
            useUiStore.getState().flashLed("error");

            return;
        }

        useGameStore.getState().acceptAgreement(REQUIRED_PLAYER_ID);
        play("confirm");
        useUiStore.getState().flashLed("ok");
        navigate("prologue.welcome");
    };

    const openClause = () => {
        setClauseOpen(true);
        play("glitch");
        grantJournal("fine-print");
        grantAchievement("read-the-fine-print");
    };

    return (
        <div className={s.screen}>
            <TerminalWindow title="Project Red / соглашение">
                <div className={s.terms}>
                    <TypedBlock items={TERMS} onDone={() => setTyped(true)} />
                </div>

                {typed && (
                    <div className={s.reveal}>
                        <button
                            type="button"
                            className={s.fine}
                            onClick={openClause}
                            aria-expanded={clauseOpen}
                        >
                            § 12.b
                        </button>
                        {clauseOpen && (
                            <p className={s.clause}>
                                § 12.b - Номер сборки не случаен. Этот пункт был
                                удален на ревью за излишнюю очевидность.
                            </p>
                        )}

                        <form className={s.form} onSubmit={submit} noValidate>
                            <TerminalField
                                label="ID игрока"
                                helper="Только зарегистрированные получатели."
                                value={playerId}
                                onChange={(e) => setPlayerId(e.target.value)}
                                error={errors.id}
                                autoFocus
                            />
                            <TerminalCheckbox
                                label="Условия прочитаны"
                                checked={read}
                                onChange={(e) => setRead(e.target.checked)}
                                error={errors.read}
                            />
                            <TerminalButton
                                variant="primary"
                                type="submit"
                                sound={null}
                            >
                                Принять и запустить
                            </TerminalButton>
                        </form>
                    </div>
                )}
            </TerminalWindow>
        </div>
    );
}
