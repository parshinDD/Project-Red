import { useEffect, useRef, useState } from "react";
import { useSceneApi } from "@/game/hooks/useSceneApi";
import { grantAchievement, grantJournal } from "@/game/rewards";
import { play } from "@/audio/audioEngine";
import { cx } from "@/lib/cx";
import TerminalButton from "@/ui/TerminalButton";
import CompletePanel from "@/ui/CompletePanel";
import LevelFrame from "@/ui/LevelFrame";
import s from "./level03.module.css";

const TARGET = 8;
const PADS = [
    { name: "КРАСНАЯ", key: "1" },
    { name: "СИНЯЯ", key: "2" },
    { name: "ЗЕЛЕНАЯ", key: "3" },
    { name: "ЖЕЛТАЯ", key: "4" },
];

const STATE_TEXT = {
    intro: "ГОТОВО",
    showing: "СМОТРИ",
    input: "ПОВТОРИ",
    waiting: "ОК",
    error: "НЕ СОВПАЛО",
    won: "ПРОЙДЕНО",
};

const COMPLETE_LINES = [
    { text: "ТЕСТ ПАМЯТИ ПРОЙДЕН", tone: "title" },
    { text: "Результат: 8/8" },
    { text: "Доступ к личным данным: 0" },
    { text: "", delay: 900 },
    {
        text: "Поправка: доступ к 1 записи.",
        tone: "err",
        glitch: true,
        delay: 500,
    },
];

function makeSequence(n) {
    const seq = [];

    for (let i = 0; i < n; i++) {
        let v;
        do v = Math.floor(Math.random() * 4);
        while (i >= 2 && seq[i - 1] === v && seq[i - 2] === v);
        seq.push(v);
    }

    return seq;
}

export default function Level03Memory() {
    const { completed, complete, damage, say, next } = useSceneApi(3);
    const seq = useRef(null);

    if (!seq.current) seq.current = makeSequence(TARGET);

    const [mode, setMode] = useState(completed ? "won" : "intro");
    const [round, setRound] = useState(1);
    const [lit, setLit] = useState(-1);
    const [errors, setErrors] = useState(0);

    const inputIdx = useRef(0);
    const timers = useRef([]);

    const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));

    useEffect(() => () => timers.current.forEach(clearTimeout), []);

    useEffect(() => {
        if (mode !== "showing") return;

        let cancelled = false;
        const local = [];
        const wait = (ms) => new Promise((r) => local.push(setTimeout(r, ms)));
        const on = Math.max(260, 520 - round * 35);

        (async () => {
            inputIdx.current = 0;
            await wait(600);

            for (let i = 0; i < round; i++) {
                if (cancelled) return;
                setLit(seq.current[i]);
                play("pad", { index: seq.current[i] });
                await wait(on);
                setLit(-1);
                await wait(170);
            }

            if (!cancelled) setMode("input");
        })();

        return () => {
            cancelled = true;
            local.forEach(clearTimeout);
            setLit(-1);
        };
    }, [mode, round]);

    const fail = () => {
        setErrors((e) => e + 1);
        setMode("error");
        play("error");
        const hp = damage();

        if (hp > 0) {
            say(
                "Последовательность не совпала. Повторяю последовательность...",
                "err",
            );
            later(() => setMode("showing"), 1100);
        }
    };

    const win = () => {
        setMode("won");
        if (errors === 0) grantAchievement("perfect-recall");

        grantJournal("memory-correction");
        later(() => complete(), 600);
    };

    const press = (i) => {
        if (mode !== "input") return;

        setLit(i);
        play("pad", { index: i });
        later(() => setLit(-1), 170);

        if (seq.current[inputIdx.current] !== i) {
            fail();
            return;
        }

        inputIdx.current += 1;
        if (inputIdx.current === round) {
            if (round === TARGET) {
                win();
                return;
            }

            setMode("waiting");
            later(() => {
                setRound((r) => r + 1);
                setMode("showing");
            }, 800);
        }
    };

    const pressRef = useRef(press);
    pressRef.current = press;

    useEffect(() => {
        const onKey = (e) => {
            if (e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;

            const i = "1234".indexOf(e.key);

            if (i >= 0) pressRef.current(i);
        };

        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    return (
        <LevelFrame
            objective={`Повторяйте последовательность. Пройдите ${TARGET} раундов. Каждая ошибка стоит 1 HP.`}
        >
            <div className={s.layout}>
                <div className={s.info}>
                    <dl className={s.readout}>
                        <div>
                            <dt>Раунд</dt>
                            <dd>
                                {Math.min(round, TARGET)}/{TARGET}
                            </dd>
                        </div>
                        <div>
                            <dt>Ошибки</dt>
                            <dd>{errors}</dd>
                        </div>
                        <div>
                            <dt>Статус</dt>
                            <dd className={s.state} aria-live="polite">
                                {STATE_TEXT[mode]}
                            </dd>
                        </div>
                    </dl>
                    {mode === "intro" && (
                        <>
                            <p className={s.text}>
                                Смотрите, как подсвечиваются кнопки, затем
                                повторите порядок. Нажимайте кнопки или клавиши
                                1-4.
                            </p>
                            <div className={s.actions}>
                                <TerminalButton
                                    variant="primary"
                                    onClick={() => setMode("showing")}
                                    autoFocus
                                >
                                    Начать тест
                                </TerminalButton>
                            </div>
                        </>
                    )}
                    {mode !== "intro" && mode !== "won" && !completed && (
                        <div className={s.actions}>
                            <TerminalButton
                                onClick={() => setMode("showing")}
                                disabled={mode !== "input"}
                            >
                                Повторить последовательность
                            </TerminalButton>
                        </div>
                    )}
                    {(mode === "won" || completed) && (
                        <CompletePanel
                            title="Тест памяти"
                            lines={COMPLETE_LINES}
                            shard={3}
                            onContinue={next}
                        />
                    )}
                </div>

                <div
                    className={s.device}
                    role="group"
                    aria-label="Кнопки памяти"
                >
                    {PADS.map((p, i) => (
                        <button
                            key={p.name}
                            type="button"
                            className={cx(
                                s.pad,
                                s[`pad${i}`],
                                lit === i && s.lit,
                            )}
                            disabled={mode !== "input"}
                            onClick={() => press(i)}
                            aria-label={`${p.name} кнопка, клавиша ${p.key}`}
                        >
                            <span className={s.key} aria-hidden="true">
                                {p.key}
                            </span>
                            <span className={s.name} aria-hidden="true">
                                {p.name}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </LevelFrame>
    );
}
