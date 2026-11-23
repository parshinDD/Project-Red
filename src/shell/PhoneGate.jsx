import { BUILD_NAME } from "@/game/constants";
import { TerminalWindow } from "@/ui/Terminal";
import TypedBlock from "@/ui/TypedBlock";
import s from "./phoneGate.module.css";

const LINES = [
    { k: "text", text: "PROJECT RED INTERACTIVE", tone: "dim", delay: 400 },
    { k: "text", text: BUILD_NAME, tone: "title", delay: 320 },
    { k: "gap", delay: 150 },
    {
        k: "leader",
        label: "Проверка устройства",
        status: "СБОЙ",
        tone: "warn",
        delay: 520,
    },
    {
        k: "leader",
        label: "Размер экрана",
        status: "НЕДОСТАТОЧЕН",
        delay: 430,
    },
    {
        k: "leader",
        label: "Физическая клавиатура",
        status: "НЕ НАЙДЕНА",
        delay: 430,
    },
    { k: "gap", delay: 260 },
    { k: "text", text: "Эта сборка рассчитана на ноутбук.", delay: 560 },
    {
        k: "text",
        text: "Это не баг. Это требование.",
        tone: "dim",
        delay: 520,
    },
    { k: "gap", delay: 150 },
    {
        k: "text",
        text: "Пожалуйста, откройте PROJECT RED на ноутбуке.",
        tone: "hint",
        delay: 680,
    },
];

export default function PhoneGate() {
    return (
        <div className={s.gate} data-theme="crt" role="status">
            <i className={s.led} aria-hidden="true" />
            <TerminalWindow
                title="Project Red / проверка устройства"
                className={s.win}
            >
                <TypedBlock items={LINES} />
            </TerminalWindow>
        </div>
    );
}
