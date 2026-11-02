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
    "Reduced lag when petting cats",
    "Enhanced quality of snacks",
    "Sofa collision fixed",
    "Patched the red-light bug",
    "Added more cats",
    "Weapon balance: none",
    "No bugs found (we hope)",
];

const ANSWER = "RESPAWN";

const COMPLETE_LINES = [
    { text: "UPDATE APPLIED", tone: "title" },
    { text: "Respawn module unlocked." },
    { text: "", delay: 250 },
    { text: "KNOWN ISSUE:", tone: "err", delay: 700 },
    { text: "The system remembers a player who has never logged in." },
    { text: "Status: Unresolved.", tone: "dim" },
];

export default function Level02Patchnotes() {
    const { completed, complete, say, next } = useSceneApi(2);

    const [value, setValue] = useState("");
    const [error, setError] = useState("");

    const submit = (e) => {
        e.preventDefault();

        if (value.trim().toUpperCase() === ANSWER) {
            grantJournal("known-issue");
            complete();
        } else {
            setError("UPDATE REJECTED: unknown recovery keyword.");
            say("No HP is lost for a wrong keyword.", "dim");
            play("error");
        }
    };

    return (
        <LevelFrame objective="Something in this changelog is not just a changelog. Find the recovery keyword.">
            <div className={s.layout}>
                <section className={s.window} aria-label="Update log">
                    <div className={s.bar}>
                        <span>Update log - build 02.1.2</span>
                        <span className={s.ver}>v1.2.0</span>
                    </div>
                    <div className={s.content}>
                        <h2 className={s.heading}>Patch notes</h2>
                        <p className={s.sub}>
                            Changes since the previous internal build:
                        </p>
                        <ul className={s.entries}>
                            {ENTRIES.map((line) => (
                                <li key={line}>{line}</li>
                            ))}
                        </ul>
                    </div>
                    <p className={s.status}>
                        Update ready · waiting for recovery keyword
                    </p>
                </section>

                <aside>
                    {completed ? (
                        <CompletePanel
                            title="Update"
                            lines={COMPLETE_LINES}
                            shard={2}
                            onContinue={next}
                        />
                    ) : (
                        <TerminalWindow title="Apply update">
                            <form
                                className={s.form}
                                onSubmit={submit}
                                noValidate
                            >
                                <TerminalField
                                    label="Recovery keyword"
                                    helper="Letters only. Wrong answers cost nothing."
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
                                    Apply update
                                </TerminalButton>
                            </form>
                        </TerminalWindow>
                    )}
                </aside>
            </div>
        </LevelFrame>
    );
}
