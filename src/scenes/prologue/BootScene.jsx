import { useEffect, useState } from "react";
import { TerminalWindow } from "@/ui/Terminal";
import TypedBlock from "@/ui/TypedBlock";
import ProgressBar from "@/ui/ProgressBar";
import TerminalButton from "@/ui/TerminalButton";
import { navigate } from "@/game/flow/navigator";
import { useUiStore } from "@/store/uiStore";
import s from "./prologue.module.css";

const HEAD = [
    { k: "text", text: "PROJECT RED INTERACTIVE", tone: "title", delay: 700 },
    { k: "text", text: "INTERNAL BUILD 02.1.2", tone: "dim", delay: 300 },
    { k: "gap", delay: 100 },
    { k: "text", text: "Initializing test environment…", delay: 350 },
];

const TAIL = [
    { k: "leader", label: "Loading assets", status: "OK", delay: 450 },
    { k: "leader", label: "Loading player profile", status: "OK", delay: 300 },
    {
        k: "leader",
        label: "Verifying recipient",
        status: "WARNING",
        tone: "warn",
        delay: 600,
    },
    { k: "gap", delay: 200 },
    {
        k: "text",
        text: "Recipient already registered.",
        tone: "err",
        delay: 600,
    },
    { k: "gap", delay: 250 },
    { k: "text", text: "NOTICE:", tone: "dim", delay: 350 },
    { k: "text", text: "This is probably a caching issue.", delay: 200 },
];

const BAR = [
    { to: 100, duration: 2.4 },
    { hold: 0.4 },
    { to: 14, duration: 0.35 },
];

export default function BootScene() {
    const [stage, setStage] = useState(0);
    const ready = stage >= 3;

    useEffect(() => {
        if (stage >= 1) useUiStore.getState().setMood("boot");
    }, [stage]);

    const next = () => navigate("prologue.agreement");

    return (
        <div className={s.screen}>
            <TerminalWindow title="Project Red / boot">
                <TypedBlock
                    items={HEAD}
                    onDone={() => setStage((v) => Math.max(v, 1))}
                />
                {stage >= 1 && (
                    <ProgressBar
                        sequence={BAR}
                        restAt={14}
                        label="Loading"
                        onDone={() => setStage((v) => Math.max(v, 2))}
                    />
                )}
                {stage >= 2 && (
                    <TypedBlock
                        items={TAIL}
                        onItem={(i) => {
                            if (i === 2) {
                                useUiStore.getState().setMood("alert");
                                useUiStore.getState().flashLed("error", 1800);
                            }
                        }}
                        onDone={() => setStage(3)}
                    />
                )}
                {ready && (
                    <div
                        className={s.reveal}
                        style={{ marginTop: "var(--sp-5)" }}
                    >
                        <TerminalButton
                            variant="primary"
                            onClick={next}
                            autoFocus
                        >
                            Continue
                        </TerminalButton>
                    </div>
                )}
            </TerminalWindow>
        </div>
    );
}
