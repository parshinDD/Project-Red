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
    { text: "ALL LIARS IDENTIFIED", tone: "title" },
    { text: "REPORT ACCEPTED" },
    { text: "", delay: 700 },
    { text: "SYSTEM STATEMENT:", tone: "dim", delay: 600 },
    {
        text: "I HAVE NOT DELETED ANY RECORDS.",
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
                `REPORT REJECTED: Suspect ${bad.id}'s statement does not match the marked set. No HP is lost.`,
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
        <LevelFrame objective="Mark every liar. A liar's statement is always false. Everyone else tells the truth.">
            <div className={s.layout}>
                <section className={s.folder} aria-label="Suspect files">
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
                                        <span>FILE</span>
                                        <b className={s.id}>{p.id}</b>
                                    </header>
                                    <div className={s.photo} aria-hidden="true">
                                        <i />
                                    </div>
                                    <blockquote className={s.says}>
                                        <span className={s.label}>
                                            Statement
                                        </span>
                                        “{p.says}”
                                    </blockquote>
                                    <button
                                        type="button"
                                        className={s.mark}
                                        aria-pressed={liar}
                                        disabled={solved}
                                        onClick={() => toggle(p.id)}
                                    >
                                        {liar
                                            ? "Marked as liar"
                                            : "Mark as liar"}
                                    </button>
                                    <span
                                        className={s.stamp}
                                        aria-hidden="true"
                                    >
                                        LIAR
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                </section>

                <div className={s.info}>
                    {solved ? (
                        <CompletePanel
                            title="Report"
                            lines={COMPLETE_LINES}
                            shard={6}
                            onContinue={next}
                        />
                    ) : (
                        <>
                            <TerminalWindow title="Vote report">
                                <p className={s.text}>
                                    Marked as liars:{" "}
                                    <b className={s.count}>
                                        {marked.length
                                            ? [...marked].sort().join(", ")
                                            : "none"}
                                    </b>
                                </p>
                                <p className={s.text}>
                                    {flag
                                        ? `REPORT REJECTED - the statement of suspect ${flag} does not match the marked set.`
                                        : "Wrong reports cost nothing. Hints are free."}
                                </p>
                            </TerminalWindow>
                            <div className={s.actions}>
                                <TerminalButton
                                    variant="primary"
                                    onClick={submit}
                                    disabled={marked.length === 0}
                                    sound={null}
                                >
                                    File report
                                </TerminalButton>
                                <TerminalButton
                                    onClick={() => {
                                        play("paper");
                                        setMarked([]);
                                        setFlag(null);
                                    }}
                                    disabled={marked.length === 0}
                                >
                                    Clear
                                </TerminalButton>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </LevelFrame>
    );
}
