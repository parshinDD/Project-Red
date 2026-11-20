import { useEffect, useState } from "react";
import { navigate } from "@/game/flow/navigator";
import { play } from "@/audio/audioEngine";
import { TerminalWindow } from "@/ui/Terminal";
import TypedBlock from "@/ui/TypedBlock";
import TerminalButton from "@/ui/TerminalButton";
import Gem from "@/ui/gem/Gem";
import { FRAGMENTS } from "./data";
import s from "./final.module.css";

const LINES = [
    { k: "text", text: "BUILD COMPLETED", tone: "title", delay: 520 },
    { k: "gap", delay: 100 },
    { k: "leader", label: "Integrity check", status: "PASSED", delay: 500 },
    {
        k: "leader",
        label: "All required fragments",
        status: "RESTORED",
        delay: 440,
    },
    { k: "gap", delay: 120 },
    { k: "text", text: "One final operation remains.", delay: 560 },
    {
        k: "text",
        text: "The package cannot be delivered through this interface.",
        delay: 620,
    },
    {
        k: "text",
        text: "Please locate the physical box.",
        tone: "hint",
        delay: 760,
    },
];

export default function FinalVerify() {
    const [stage, setStage] = useState(0);

    useEffect(() => {
        if (stage !== 1) return;

        play("gem");
        const t = setTimeout(() => setStage(2), 1900);

        return () => clearTimeout(t);
    }, [stage]);

    return (
        <div className={s.screen}>
            <TerminalWindow title="Archive check">
                <TypedBlock
                    items={LINES}
                    onItem={(i) => {
                        if (i === 2) play("stamp");
                    }}
                    onDone={() => setStage(1)}
                />

                {stage >= 1 && (
                    <section
                        className={s.vaultStrip}
                        aria-label="All twelve fragments restored"
                    >
                        <p className={s.manifestTitle}>
                            ALL FRAGMENTS RESTORED
                        </p>
                        <ul className={s.strip}>
                            {FRAGMENTS.map((f, i) => (
                                <li
                                    key={f.level}
                                    className={s.stripGem}
                                    style={{ "--i": i }}
                                >
                                    <Gem n={f.level} size="2rem" />
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {stage >= 2 && (
                    <div className={s.actions}>
                        <TerminalButton
                            variant="primary"
                            onClick={() => navigate("final.report")}
                            autoFocus
                        >
                            Open final report
                        </TerminalButton>
                    </div>
                )}
            </TerminalWindow>
        </div>
    );
}
