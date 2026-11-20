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
        label: "Device check",
        status: "FAILED",
        tone: "warn",
        delay: 520,
    },
    {
        k: "leader",
        label: "Screen size",
        status: "INSUFFICIENT",
        delay: 430,
    },
    {
        k: "leader",
        label: "Physical keyboard",
        status: "NOT FOUND",
        delay: 430,
    },
    { k: "gap", delay: 260 },
    { k: "text", text: "This build was designed for a laptop.", delay: 560 },
    {
        k: "text",
        text: "It is not a bug. It is a requirement.",
        tone: "dim",
        delay: 520,
    },
    { k: "gap", delay: 150 },
    {
        k: "text",
        text: "Please reopen PROJECT RED on a laptop.",
        tone: "hint",
        delay: 680,
    },
];

export default function PhoneGate() {
    return (
        <div className={s.gate} data-theme="crt" role="status">
            <i className={s.led} aria-hidden="true" />
            <TerminalWindow
                title="Project Red / device check"
                className={s.win}
            >
                <TypedBlock items={LINES} />
            </TerminalWindow>
        </div>
    );
}
