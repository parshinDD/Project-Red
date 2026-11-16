import { useRef, useState } from "react";
import { useSceneApi } from "@/game/hooks/useSceneApi";
import { grantJournal } from "@/game/rewards";
import { play } from "@/audio/audioEngine";
import TerminalButton from "@/ui/TerminalButton";
import CompletePanel from "@/ui/CompletePanel";
import LevelFrame from "@/ui/LevelFrame";
import { CIPHERTEXT, LENGTH, QUOTE, isAnswer } from "./cipher";
import s from "./level10.module.css";

const COMPLETE_LINES = [
    { text: "TRANSMISSION DECODED", tone: "title" },
    { text: "" },
    { text: "Source remains unknown.", tone: "dim", delay: 500 },
];

const isLetter = (ch) => /\p{L}/u.test(ch);

export default function Level10Cipher() {
    const { completed, complete, next } = useSceneApi(10);

    const [letters, setLetters] = useState(() => Array(LENGTH).fill(""));
    const [note, setNote] = useState("");
    const [done, setDone] = useState(false);

    const refs = useRef([]);

    const full = letters.every(Boolean);
    const source = Array.from(CIPHERTEXT);

    const focus = (i) => {
        const el = refs.current[Math.max(0, Math.min(LENGTH - 1, i))];

        el?.focus();
        el?.select();
    };

    const put = (i, chars) => {
        const clean = Array.from(chars).filter(isLetter);
        if (!clean.length) return;

        setNote("");
        setLetters((cur) => {
            const out = [...cur];

            clean.slice(0, LENGTH - i).forEach((ch, k) => {
                out[i + k] = ch.toUpperCase();
            });

            return out;
        });

        play("tick");
        focus(Math.min(i + clean.length, LENGTH - 1));
    };

    const submit = () => {
        if (!full) return;

        if (isAnswer(letters)) {
            play("trialPass");
            setNote("");
            setDone(true);
            grantJournal("morse-table");
            complete();
        } else {
            play("error");
            setNote(
                "DECODE REJECTED: the word does not match the transmission.",
            );
        }
    };

    const onKeyDown = (i) => (e) => {
        if (e.key === "Backspace") {
            e.preventDefault();
            setNote("");

            if (letters[i]) {
                setLetters((cur) => cur.map((v, k) => (k === i ? "" : v)));
            } else if (i > 0) {
                setLetters((cur) => cur.map((v, k) => (k === i - 1 ? "" : v)));
                focus(i - 1);
            }
        } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            focus(i - 1);
        } else if (e.key === "ArrowRight") {
            e.preventDefault();
            focus(i + 1);
        } else if (e.key === "Enter") {
            submit();
        }
    };

    return (
        <LevelFrame objective="Decode the intercepted transmission.">
            <div className={s.layout}>
                {done || completed ? (
                    <CompletePanel
                        title="Scout cipher"
                        lines={COMPLETE_LINES}
                        shard={10}
                        onContinue={next}
                    />
                ) : (
                    <>
                        <section
                            className={s.dispatch}
                            aria-label="Transmission"
                        >
                            <header className={s.head}>
                                <span>INTERCEPTED TRANSMISSION</span>
                                <span>SOURCE: UNKNOWN</span>
                            </header>

                            <div
                                className={s.cipher}
                                role="group"
                                aria-label={`Transmission ${CIPHERTEXT}`}
                            >
                                {source.map((ch, i) => (
                                    <div key={i} className={s.col}>
                                        <span className={s.sent}>{ch}</span>
                                        <input
                                            ref={(el) => (refs.current[i] = el)}
                                            className={s.slot}
                                            value={letters[i]}
                                            inputMode="text"
                                            autoComplete="off"
                                            autoCapitalize="characters"
                                            spellCheck={false}
                                            aria-label={`Letter ${i + 1} of ${LENGTH}`}
                                            onChange={(e) => {
                                                const v = e.target.value;

                                                if (!v) {
                                                    setLetters((cur) =>
                                                        cur.map((c, k) =>
                                                            k === i ? "" : c,
                                                        ),
                                                    );
                                                } else {
                                                    put(i, v.slice(-1));
                                                }
                                            }}
                                            onPaste={(e) => {
                                                e.preventDefault();
                                                put(
                                                    i,
                                                    e.clipboardData.getData(
                                                        "text",
                                                    ),
                                                );
                                            }}
                                            onFocus={(e) => e.target.select()}
                                            onKeyDown={onKeyDown(i)}
                                        />
                                    </div>
                                ))}
                            </div>

                            <blockquote className={s.quote}>
                                {QUOTE.map((l) => (
                                    <span key={l}>{l}</span>
                                ))}
                            </blockquote>
                        </section>

                        <div className={s.actions}>
                            <TerminalButton
                                variant="primary"
                                onClick={submit}
                                disabled={!full}
                                sound={null}
                            >
                                Submit
                            </TerminalButton>
                        </div>

                        {note && (
                            <p className={s.note} role="alert">
                                {note}
                            </p>
                        )}
                    </>
                )}
            </div>
        </LevelFrame>
    );
}
