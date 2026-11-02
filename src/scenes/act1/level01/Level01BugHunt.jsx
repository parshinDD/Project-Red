import { useCallback, useRef, useState } from "react";
import { useGameStore } from "@/store/gameStore";
import { useSceneApi } from "@/game/hooks/useSceneApi";
import { grantAchievement, grantJournal } from "@/game/rewards";
import { play } from "@/audio/audioEngine";
import { TerminalWindow } from "@/ui/Terminal";
import { TerminalField } from "@/ui/TerminalField";
import TerminalButton from "@/ui/TerminalButton";
import CompletePanel from "@/ui/CompletePanel";
import LevelFrame from "@/ui/LevelFrame";
import PixelScene from "./PixelScene";
import { BUGS, ANSWER, SCENE_W, SCENE_H } from "./bugs";
import s from "./level01.module.css";

const COMPLETE_LINES = [
    { text: "5/5 ANOMALIES FOUND", tone: "title" },
    { text: "Generated report: PATCH" },
    { text: "" },
    { text: "RECOVERY MODE: 1%", tone: "hint" },
];

const STEP = 6;
let pingId = 0;

export default function Level01BugHunt() {
    const { completed, active, progress, setProgress, say, complete, next } =
        useSceneApi(1);

    const found = progress?.found ?? [];
    const allFound = found.length === BUGS.length;

    const wrapRef = useRef(null);

    const [pings, setPings] = useState([]);
    const [cursor, setCursor] = useState(null);
    const [code, setCode] = useState("");
    const [codeError, setCodeError] = useState("");

    const inspect = useCallback(
        (x, y) => {
            const st = useGameStore.getState();
            if (st.phase !== "LEVEL_ACTIVE") return;

            const already = st.levelProgress[1]?.found ?? [];
            const bug = BUGS.find(
                (b) =>
                    x >= b.rect.x - 3 &&
                    x <= b.rect.x + b.rect.w + 3 &&
                    y >= b.rect.y - 3 &&
                    y <= b.rect.y + b.rect.h + 3,
            );

            if (!bug) {
                play("miss");
                const id = ++pingId;
                setPings((p) => [...p, { id, x, y }]);

                setTimeout(
                    () => setPings((p) => p.filter((q) => q.id !== id)),
                    650,
                );

                return;
            }

            if (already.includes(bug.id)) {
                say(`Anomaly #${bug.number} is already logged.`, "dim");
                return;
            }

            const list = [...already, bug.id];
            setProgress({ found: list });
            play("found");
            say(`ANOMALY #${bug.number} LOGGED — tag “${bug.letter}”`, "hint");

            if (list.length === BUGS.length) {
                say("5/5 ANOMALIES FOUND. Enter the generated report.", "hint");
                grantAchievement("bug-hunter");
            }
        },
        [setProgress, say],
    );

    const onPointerDown = (e) => {
        if (!active) return;

        const r = wrapRef.current.getBoundingClientRect();
        inspect(
            ((e.clientX - r.left) / r.width) * SCENE_W,
            ((e.clientY - r.top) / r.height) * SCENE_H,
        );
    };

    const onKeyDown = (e) => {
        if (!active) return;

        const d = e.shiftKey ? STEP * 3 : STEP;
        const move = {
            ArrowLeft: [-d, 0],
            ArrowRight: [d, 0],
            ArrowUp: [0, -d],
            ArrowDown: [0, d],
        }[e.key];

        if (move) {
            e.preventDefault();
            setCursor((c) => {
                const cur = c ?? { x: SCENE_W / 2, y: SCENE_H / 2 };

                return {
                    x: Math.min(SCENE_W - 1, Math.max(0, cur.x + move[0])),
                    y: Math.min(SCENE_H - 1, Math.max(0, cur.y + move[1])),
                };
            });
        } else if ((e.key === "Enter" || e.key === " ") && cursor) {
            e.preventDefault();
            inspect(cursor.x, cursor.y);
        }
    };

    const submit = (e) => {
        e.preventDefault();

        if (code.trim().toUpperCase() === ANSWER) {
            grantJournal("level-1-report");
            complete();
        } else {
            setCodeError(
                "REPORT REJECTED: the tags do not form a valid report.",
            );
            say("Tags are ordered by defect number, not by discovery.", "dim");
            play("error");
        }
    };

    return (
        <LevelFrame objective="Find the five anomalies hidden in the build. Each one leaves a tag.">
            <div className={s.layout}>
                <div className={s.board}>
                    <div
                        ref={wrapRef}
                        className={s.sceneWrap}
                        tabIndex={0}
                        role="group"
                        aria-label="Game scene"
                        aria-describedby="scene-help"
                        onPointerDown={onPointerDown}
                        onKeyDown={onKeyDown}
                        onBlur={() => setCursor(null)}
                    >
                        <PixelScene
                            found={found}
                            pings={pings}
                            cursor={cursor}
                        />
                    </div>
                    <p id="scene-help" className={s.caption}>
                        Click to inspect · or arrow keys to aim, Enter to
                        inspect
                    </p>
                </div>

                <aside>
                    {completed ? (
                        <CompletePanel
                            title="Report"
                            lines={COMPLETE_LINES}
                            shard={1}
                            onContinue={next}
                        />
                    ) : (
                        <TerminalWindow title="Bug report">
                            <div className={s.report}>
                                <p className={s.count}>
                                    Anomalies found:{" "}
                                    <b>
                                        {found.length}/{BUGS.length}
                                    </b>
                                </p>
                                {found.length === 0 ? (
                                    <p className={s.none}>
                                        Nothing logged yet.
                                    </p>
                                ) : (
                                    <ol
                                        className={s.found}
                                        aria-label="Logged anomalies, in order of discovery"
                                    >
                                        {found.map((id) => {
                                            const b = BUGS.find(
                                                (x) => x.id === id,
                                            );
                                            return (
                                                <li key={id}>
                                                    <span className={s.num}>
                                                        #{b.number}
                                                    </span>
                                                    <span>{b.label}</span>
                                                    <span
                                                        className={s.tagLetter}
                                                        aria-label={`tag ${b.letter}`}
                                                    >
                                                        {b.letter}
                                                    </span>
                                                </li>
                                            );
                                        })}
                                    </ol>
                                )}
                                <form
                                    className={s.codeForm}
                                    onSubmit={submit}
                                    noValidate
                                >
                                    <TerminalField
                                        label="Generated report"
                                        helper={
                                            allFound
                                                ? "Tags are ordered by defect number, not by discovery."
                                                : `Locked: ${BUGS.length - found.length} anomalies unresolved.`
                                        }
                                        value={code}
                                        onChange={(e) => {
                                            setCode(e.target.value);
                                            setCodeError("");
                                        }}
                                        error={codeError}
                                        disabled={!allFound}
                                    />
                                    <TerminalButton
                                        variant="primary"
                                        type="submit"
                                        sound={null}
                                        disabled={!allFound}
                                    >
                                        Submit report
                                    </TerminalButton>
                                </form>
                            </div>
                        </TerminalWindow>
                    )}
                </aside>
            </div>
        </LevelFrame>
    );
}
