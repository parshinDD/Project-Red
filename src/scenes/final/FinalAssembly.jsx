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
    { k: "text", text: "МОДУЛЬ ВОССТАНОВЛЕНИЯ АКТИВЕН", tone: "title", delay: 520 },
    { k: "gap", delay: 100 },
    { k: "leader", label: "Восстановлено фрагментов", status: "12", delay: 460 },
    { k: "leader", label: "Необходимые данные", status: "ПРОВЕРЕНЫ", delay: 420 },
    {
        k: "leader",
        label: "Ключ архива",
        status: "НЕПОЛНЫЙ",
        tone: "warn",
        delay: 560,
    },
];

const HEAD_DONE = HEAD.map((item) =>
    item.label === "Ключ архива"
        ? { ...item, status: "СОБРАН", tone: undefined, delay: 0 }
        : { ...item, delay: 0 },
);

const ACCEPTED = [
    { k: "text", text: "КЛЮЧ АРХИВА ПРИНЯТ", tone: "title", delay: 480 },
    { k: "gap", delay: 100 },
    { k: "leader", label: "Формат ключа", status: "ВЕРНЫЙ", delay: 440 },
    { k: "leader", label: "Архив", status: "ГОТОВ", delay: 440 },
    { k: "gap", delay: 160 },
    {
        k: "text",
        text: "Копия ключа добавлена в ваш журнал.",
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
            "КЛЮЧ ОТКЛОНЕН: фрагменты не складываются в эту последовательность.",
        );
        setAttempts((n) => n + 1);
    };

    return (
        <div className={s.screen}>
            <TerminalWindow title="Восстановление / сборка">
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
                        aria-label="Манифест фрагментов"
                    >
                        <p className={s.manifestTitle}>МАНИФЕСТ ФРАГМЕНТОВ</p>
                        <ul className={s.cards}>
                            {FRAGMENTS.map((f, i) => (
                                <li
                                    key={f.level}
                                    className={s.card}
                                    style={{ "--i": i }}
                                    onMouseEnter={() => setHoverPos(f.pos)}
                                    onMouseLeave={() => setHoverPos(null)}
                                    aria-label={`Уровень ${f.level}: символ ${f.symbol}, позиция ${f.pos}`}
                                >
                                    <Gem n={f.level} size="1.7rem" />
                                    <span className={s.cardLvl}>
                                        УР. {pad2(f.level)}
                                    </span>
                                    <span className={s.cardSym}>
                                        {f.symbol}
                                    </span>
                                    <span className={s.cardPos}>
                                        ПОЗ {pad2(f.pos)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {phase !== "head" && (
                    <section
                        className={s.keyArea}
                        aria-label="Ввод ключа архива"
                    >
                        <p className={s.keyLabel}>КЛЮЧ АРХИВА</p>

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
                                        -
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
                                    aria-label="Ключ архива, 12 символов"
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
                                        Собрать ключ
                                    </TerminalButton>
                                </div>
                                <p
                                    className={`${s.keyNote} tnum`}
                                    aria-hidden="true"
                                >
                                    Символов: {filled}/{KEY_LETTERS.length} ·
                                    дефисы ставятся автоматически
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
                                        В манифесте перечислена каждая позиция.
                                        У каждого фрагмента ровно одна.
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
                                    Продолжить
                                </TerminalButton>
                            </div>
                        )}
                    </>
                )}
            </TerminalWindow>
        </div>
    );
}
