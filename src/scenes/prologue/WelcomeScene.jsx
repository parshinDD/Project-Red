import { useMemo, useState } from "react";
import { useGameStore } from "@/store/gameStore";
import { TerminalWindow } from "@/ui/Terminal";
import TypedBlock from "@/ui/TypedBlock";
import TerminalButton from "@/ui/TerminalButton";
import { navigate } from "@/game/flow/navigator";
import s from "./prologue.module.css";

export default function WelcomeScene() {
    const playerId = useGameStore((st) => st.playerId);

    const [done, setDone] = useState(false);

    const items = useMemo(
        () => [
            {
                k: "text",
                text: `Добро пожаловать, ${playerId || "игрок"}.`,
                tone: "title",
                delay: 600,
            },
            { k: "gap", delay: 150 },
            {
                k: "text",
                text: "Ваша тестовая сессия активна.",
                delay: 350,
            },
            {
                k: "text",
                text: "Пожалуйста, не пытайтесь починить игру.",
                delay: 450,
            },
            {
                k: "text",
                text: "Формально говоря, это не ваша работа.",
                tone: "dim",
                delay: 650,
            },
        ],
        [playerId],
    );

    const start = () => navigate("level.1");

    return (
        <div className={s.screen}>
            <TerminalWindow title="Project Red / сессия">
                <TypedBlock items={items} onDone={() => setDone(true)} />
                {done && (
                    <div
                        className={s.reveal}
                        style={{ marginTop: "var(--sp-5)" }}
                    >
                        <TerminalButton
                            variant="primary"
                            onClick={start}
                            autoFocus
                        >
                            Начать уровень 01
                        </TerminalButton>
                    </div>
                )}
            </TerminalWindow>
        </div>
    );
}
