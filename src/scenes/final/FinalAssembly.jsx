import { useEffect, useRef, useState } from "react";
import { navigate } from "@/game/flow/navigator";
import { useGameStore } from "@/store/gameStore";
import { grantJournal } from "@/game/rewards";
import { play } from "@/audio/audioEngine";
import { TerminalWindow } from "@/ui/Terminal";
import TypedBlock from "@/ui/TypedBlock";
import TerminalButton from "@/ui/TerminalButton";
import Gem from "@/ui/gem/Gem";
import { pad2 } from "@/game/flow/nodes";
import {
    FRAGMENTS,
    KEY_LETTERS,
    isArchiveKey,
    keySlots,
    normalizeKey,
} from "./data";
import s from "./final.module.css";

const HEAD = [
    { k: "text", text: "RECOVERY MODULE ACTIVE", tone: "title", delay: 520 },
    { k: "gap", delay: 100 },
    { k: "leader", label: "Fragments recovered", status: "12", delay: 460 },
    { k: "leader", label: "Required data", status: "VERIFIED", delay: 420 },
    {
        k: "leader",
        label: "Archive key",
        status: "INCOMPLETE",
        tone: "warn",
        delay: 560,
    },
];

const HEAD_DONE = HEAD.map((item) =>
    item.label === "Archive key"
        ? { ...item, status: "COMPLETE", tone: undefined, delay: 0 }
        : { ...item, delay: 0 },
);

const ACCEPTED = [
    { k: "text", text: "ARCHIVE KEY ACCEPTED", tone: "title", delay: 480 },
    { k: "gap", delay: 100 },
    { k: "leader", label: "Key format", status: "VALID", delay: 440 },
    { k: "leader", label: "Archive", status: "READY", delay: 440 },
    { k: "gap", delay: 160 },
    {
        k: "text",
        text: "A copy of the key has been filed to your journal.",
        tone: "dim",
        delay: 520,
    },
];

export default function FinalAssembly() {
    const finale = useGameStore((st) => st.finale);
    const ready = finale === "ARCHIVE_READY" || finale === "COMPLETE";

    const [phase, setPhase] = useState(ready ? "accepted" : "head");
    const [letters, setLetters] = useState(ready ? KEY_LETTERS : "");
    const [error, setError] = useState("");
    const [attempts, setAttempts] = useState(0);
    const [acceptedDone, setAcceptedDone] = useState(false);
    const [hoverPos, setHoverPos] = useState(null);

    const inputRef = useRef(null);

    useEffect(() => {
        if (useGameStore.getState().finale === "LOCKED")
            useGameStore.getState().setFinale("ASSEMBLY");
    }, []);

    const focusInput = (at) => {
        const el = inputRef.current;

        if (!el) return;

        el.focus();
        if (at != null) {
            const i = Math.min(at, el.value.length);
            el.setSelectionRange(i, i);
        }
    };

    useEffect(() => {
        if (phase === "assemble") focusInput();
    }, [phase]);

    const cells = keySlots(letters);
    const filled = letters.length;
    const activeIdx = phase === "assemble" ? filled : -1;

    const onChange = (e) => {
        const next = normalizeKey(e.target.value);

        if (next.length > letters.length) {
            play("tick");
        } else if (next.length < letters.length) {
            play("miss");
        }

        setLetters(next);
        setError("");
    };

    const submit = () => {
        if (!letters) return;

        if (isArchiveKey(letters)) {
            play("mountOk");
            setError("");

            [...KEY_LETTERS].forEach((_, i) =>
                setTimeout(() => play("tick"), 120 + i * 80),
            );

            setTimeout(() => {
                play("confirm");
                useGameStore.getState().setFinale("ARCHIVE_READY");
                grantJournal("archive-key");
                setPhase("accepted");
            }, 1250);

            return;
        }

        play("error");
        setError(
            "KEY REJECTED: the fragments do not assemble into this sequence.",
        );
        setAttempts((n) => n + 1);
    };

    return (
        <div className={s.screen}>
            <TerminalWindow title="Recovery / assembly">
                {phase !== "accepted" ? (
                    <TypedBlock
                        items={HEAD}
                        onDone={() => {
                            play("rackOn", { index: 0 });
                            setPhase("assemble");
                        }}
                    />
                ) : (
                    <TypedBlock items={HEAD_DONE} instant />
                )}

                {phase !== "head" && (
                    <section
                        className={s.manifest}
                        aria-label="Fragment manifest"
                    >
                        <p className={s.manifestTitle}>FRAGMENT MANIFEST</p>
                        <ul className={s.cards}>
                            {FRAGMENTS.map((f, i) => (
                                <li
                                    key={f.level}
                                    className={s.card}
                                    style={{ "--i": i }}
                                    onMouseEnter={() => setHoverPos(f.pos)}
                                    onMouseLeave={() => setHoverPos(null)}
                                    aria-label={`Level ${f.level}: symbol ${f.symbol}, position ${f.pos}`}
                                >
                                    <Gem n={f.level} size="1.7rem" />
                                    <span className={s.cardLvl}>
                                        LVL {pad2(f.level)}
                                    </span>
                                    <span className={s.cardSym}>
                                        {f.symbol}
                                    </span>
                                    <span className={s.cardPos}>
                                        POS {pad2(f.pos)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {phase !== "head" && (
                    <section
                        className={s.keyArea}
                        aria-label="Archive key input"
                    >
                        <p className={s.keyLabel}>ARCHIVE KEY</p>

                        <div
                            key={`slots-${attempts}`}
                            className={`${s.slotsWrap} ${
                                attempts > 0 && error ? s.shake : ""
                            }`}
                            data-state={phase}
                        >
                            {cells.map((c, i) =>
                                c.hyphen ? (
                                    <span
                                        key={`h${i}`}
                                        className={s.hyphen}
                                        aria-hidden="true"
                                    >
                                        –
                                    </span>
                                ) : (
                                    <button
                                        key={c.idx}
                                        type="button"
                                        className={s.slot}
                                        data-filled={
                                            c.char ? "true" : undefined
                                        }
                                        data-active={
                                            c.idx === activeIdx || undefined
                                        }
                                        data-sel={
                                            hoverPos === c.idx + 1 || undefined
                                        }
                                        data-accept={
                                            phase === "accepted" || undefined
                                        }
                                        style={{ "--i": c.idx }}
                                        tabIndex={-1}
                                        aria-hidden="true"
                                        onClick={() => focusInput(c.idx)}
                                    >
                                        {c.char}
                                    </button>
                                ),
                            )}
                        </div>

                        {phase === "assemble" && (
                            <>
                                <input
                                    ref={inputRef}
                                    className={s.hiddenInput}
                                    value={letters}
                                    onChange={onChange}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") submit();
                                    }}
                                    autoComplete="off"
                                    autoCapitalize="characters"
                                    spellCheck={false}
                                    aria-label="Archive key, 12 characters"
                                    aria-describedby={
                                        error ? "key-error" : undefined
                                    }
                                    aria-invalid={error ? "true" : undefined}
                                />
                                <div className={s.keyActions}>
                                    <TerminalButton
                                        variant="primary"
                                        onClick={submit}
                                        disabled={!letters}
                                        sound={null}
                                    >
                                        Assemble key
                                    </TerminalButton>
                                </div>
                                <p
                                    className={`${s.keyNote} tnum`}
                                    aria-hidden="true"
                                >
                                    {filled}/{KEY_LETTERS.length} characters ·
                                    hyphens are automatic
                                </p>
                                {error && (
                                    <p
                                        id="key-error"
                                        className={s.keyError}
                                        role="alert"
                                    >
                                        {error}
                                    </p>
                                )}
                                {attempts >= 2 && (
                                    <p className={s.keyNote}>
                                        The manifest lists every position. Each
                                        fragment holds exactly one.
                                    </p>
                                )}
                            </>
                        )}
                    </section>
                )}

                {phase === "accepted" && (
                    <>
                        <TypedBlock
                            items={ACCEPTED}
                            onDone={() => setAcceptedDone(true)}
                        />
                        {acceptedDone && (
                            <div className={s.actions}>
                                <TerminalButton
                                    variant="primary"
                                    onClick={() => navigate("final.verify")}
                                    autoFocus
                                >
                                    Continue
                                </TerminalButton>
                            </div>
                        )}
                    </>
                )}
            </TerminalWindow>
        </div>
    );
}
