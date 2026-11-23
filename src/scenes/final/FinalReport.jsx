import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useGameStore } from "@/store/gameStore";
import { useUiStore } from "@/store/uiStore";
import { grantAchievement } from "@/game/rewards";
import { getAudioNodes, play } from "@/audio/audioEngine";
import { createFinaleMusic } from "@/audio/soundsFinal";
import { TerminalWindow } from "@/ui/Terminal";
import TypedBlock from "@/ui/TypedBlock";
import TerminalButton from "@/ui/TerminalButton";
import { FINAL_LINES, PACKAGE_LINE } from "./data";
import s from "./final.module.css";

const REPORT = [
    { k: "text", text: "ФИНАЛЬНЫЙ ОТЧЕТ", tone: "title", delay: 520 },
    { k: "gap", delay: 100 },
    { k: "leader", label: "Тестовые сценарии", status: "ЗАВЕРШЕНЫ", delay: 480 },
    { k: "leader", label: "Целостность памяти", status: "ВОССТАНОВЛЕНА", delay: 440 },
    { k: "leader", label: "Личность игрока", status: "ПОДТВЕРЖДЕНА", delay: 440 },
    {
        k: "leader",
        label: "Фрагменты архива",
        status: "СИНХРОНИЗИРОВАНЫ",
        delay: 480,
    },
    { k: "gap", delay: 180 },
    { k: "text", text: "Остался один файл.", delay: 560 },
    { k: "text", text: "FINAL_MESSAGE.dat", tone: "hint", delay: 640 },
    { k: "leader", label: "Статус", status: "ГОТОВ", delay: 520 },
];

const TYPE_MS = 55;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function FinalReport() {
    const finished = useGameStore((st) => st.finale) === "COMPLETE";

    const [stage, setStage] = useState(finished ? "blackout" : "report");
    const [reportDone, setReportDone] = useState(false);
    const [line, setLine] = useState(finished ? FINAL_LINES.length : -1);
    const [typed, setTyped] = useState(0);
    const [shift, setShift] = useState(0);
    const [veilOn, setVeilOn] = useState(finished);
    const [packageOn, setPackageOn] = useState(finished);
    const [engraved, setEngraved] = useState(finished);

    const runRef = useRef(false);
    const finishedRef = useRef(finished);
    const veilTimers = useRef([]);

    const viewRef = useRef(null);
    const trackRef = useRef(null);

    useEffect(() => () => veilTimers.current.forEach(clearTimeout), []);

    useLayoutEffect(() => {
        const view = viewRef.current;
        const track = trackRef.current;

        if (!view || !track || line < 0) return;

        const cur = track.children[line];
        if (!cur) return;

        const target =
            cur.offsetTop + cur.offsetHeight / 2 - view.clientHeight / 2;

        setShift(-Math.round(target));
    }, [line]);

    useEffect(() => {
        if (stage !== "message") return;

        let alive = true;
        const reduce = window.matchMedia?.(
            "(prefers-reduced-motion: reduce)",
        ).matches;

        const wait = (ms) => sleep(ms).then(() => alive);

        (async () => {
            if (!(await wait(900))) return;

            for (let i = 0; i < FINAL_LINES.length; i++) {
                const item = FINAL_LINES[i];

                setLine(i);
                setTyped(reduce ? item.text.length : 0);

                if (!reduce) {
                    for (let c = 1; c <= item.text.length; c++) {
                        if (!(await wait(TYPE_MS))) return;

                        setTyped(c);
                        if (c % 3 === 0) play("tick");
                    }
                }

                if (item.beat === "only") grantAchievement("the-only-player");

                if (!(await wait(item.pause))) return;
            }

            setLine(FINAL_LINES.length);
            if (!(await wait(600))) return;

            setStage("snap");
        })();

        return () => {
            alive = false;
        };
    }, [stage]);

    useEffect(() => {
        if (stage !== "snap" || finishedRef.current) return;

        useUiStore.getState().setMood("dead");
        play("powerDown");

        const at = (ms, fn) => veilTimers.current.push(setTimeout(fn, ms));

        at(2600, () => setVeilOn(true));
        at(5600, () => setPackageOn(true));
        at(8800, () => useGameStore.getState().completeGame());
        at(10200, () => setEngraved(true));
    }, [stage]);

    const musicRef = useRef(null);
    const startMusic = useRef(() => {});

    startMusic.current = () => {
        if (musicRef.current) return;

        const nodes = getAudioNodes();

        if (!nodes) return;

        musicRef.current = createFinaleMusic(nodes);
        musicRef.current.start();
    };

    useEffect(() => {
        if (packageOn) startMusic.current();
    }, [packageOn]);

    useEffect(() => {
        const retry = () => {
            setTimeout(() => {
                if (useGameStore.getState().finale === "COMPLETE")
                    startMusic.current();
            }, 200);
        };

        document.addEventListener("pointerdown", retry);
        document.addEventListener("keydown", retry);

        return () => {
            document.removeEventListener("pointerdown", retry);
            document.removeEventListener("keydown", retry);
            musicRef.current?.stop();
        };
    }, []);

    const runFile = () => {
        if (runRef.current) return;

        runRef.current = true;
        useUiStore.getState().setMood("message");
        play("relay");
        setStage("message");
    };

    return (
        <div className={s.reportScreen}>
            {stage === "report" && (
                <div className={s.screen}>
                    <TerminalWindow title="Финальный отчет">
                        <TypedBlock
                            items={REPORT}
                            onDone={() => setReportDone(true)}
                        />
                        {reportDone && (
                            <div className={s.actions}>
                                <TerminalButton
                                    variant="primary"
                                    onClick={runFile}
                                    sound="mode"
                                    autoFocus
                                >
                                    Запустить FINAL_MESSAGE.dat
                                </TerminalButton>
                            </div>
                        )}
                    </TerminalWindow>
                </div>
            )}

            {(stage === "message" || stage === "snap") && (
                <section
                    className={s.message}
                    data-snap={stage === "snap" || undefined}
                    aria-label="Финальное послание"
                >
                    <p className={s.messageFile} aria-hidden="true">
                        FINAL_MESSAGE.dat
                    </p>
                    <div className={s.messageView} ref={viewRef}>
                        <div
                            className={s.messageTrack}
                            ref={trackRef}
                            style={{ transform: `translateY(${shift}px)` }}
                        >
                            {FINAL_LINES.map((item, i) => {
                                if (i > line) return null;

                                const current = i === line;

                                return (
                                    <p
                                        key={i}
                                        className={s.msgLine}
                                        data-past={!current || undefined}
                                        data-system={item.tone || undefined}
                                    >
                                        <span className="srOnly">
                                            {item.text}
                                        </span>
                                        <span aria-hidden="true">
                                            {current
                                                ? item.text.slice(0, typed)
                                                : item.text}
                                        </span>
                                        {current &&
                                            typed < item.text.length && (
                                                <i
                                                    className={s.msgCaret}
                                                    aria-hidden="true"
                                                />
                                            )}
                                    </p>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {stage === "snap" && (
                <i className={s.crtDeath} aria-hidden="true">
                    <i className={s.crtDot} />
                </i>
            )}

            {(veilOn || finished) &&
                createPortal(
                    <div className={s.veil} aria-hidden="true">
                        <i className={s.veilBlack} data-instant={finished} />
                        {packageOn && (
                            <div className={s.packageWrap}>
                                <p className={s.packageLine}>{PACKAGE_LINE}</p>
                                {engraved && (
                                    <p className={s.engrave}>
                                        PROJECT RED · BUILD_02-12
                                    </p>
                                )}
                            </div>
                        )}
                    </div>,
                    document.body,
                )}
        </div>
    );
}
