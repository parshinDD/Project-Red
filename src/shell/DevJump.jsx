import { useEffect, useRef, useState } from "react";
import { DEV_TOOLS, devJump } from "@/game/dev";
import { NODES, ACTS } from "@/game/flow/nodes";
import { useGameStore } from "@/store/gameStore";
import s from "./devJump.module.css";

const groups = [...new Set(NODES.map((n) => n.act))].map((act) => ({
    act,
    title:
        act === 0
            ? "ПРОЛОГ"
            : act === 5
              ? "ФИНАЛ"
              : `АКТ ${ACTS[act].roman} · ${ACTS[act].name}`,
    nodes: NODES.filter((n) => n.act === act),
}));

function Panel() {
    const [open, setOpen] = useState(false);
    const [completeBefore, setCompleteBefore] = useState(true);
    const [restoreHp, setRestoreHp] = useState(true);
    const [instant, setInstant] = useState(false);

    const nodeId = useGameStore((st) => st.nodeId);

    const root = useRef(null);

    useEffect(() => {
        const onKey = (e) => {
            if (e.altKey && e.shiftKey && e.code === "KeyG") {
                e.preventDefault();
                setOpen((v) => !v);
            } else if (e.key === "Escape" && open) {
                e.stopImmediatePropagation();
                setOpen(false);
            }
        };

        window.addEventListener("keydown", onKey, true);
        return () => window.removeEventListener("keydown", onKey, true);
    }, [open]);

    const go = (id) => {
        if (devJump(id, { completeBefore, restoreHp, instant })) setOpen(false);
    };

    return (
        <div className={s.dev} ref={root}>
            <button
                type="button"
                className={s.toggle}
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                title="Alt+Shift+G"
            >
                DEV
            </button>
            {open && (
                <div
                    className={s.panel}
                    role="dialog"
                    aria-label="Dev: переход к любому экрану"
                >
                    <div className={s.opts}>
                        <label>
                            <input
                                type="checkbox"
                                checked={completeBefore}
                                onChange={(e) =>
                                    setCompleteBefore(e.target.checked)
                                }
                            />{" "}
                            отметить предыдущие уровни решенными
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={restoreHp}
                                onChange={(e) => setRestoreHp(e.target.checked)}
                            />{" "}
                            восстановить HP
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={instant}
                                onChange={(e) => setInstant(e.target.checked)}
                            />{" "}
                            без перехода
                        </label>
                    </div>
                    <div className={s.list}>
                        {groups.map((g) => (
                            <section key={g.act}>
                                <h3>{g.title}</h3>
                                {g.nodes.map((n) => (
                                    <button
                                        key={n.id}
                                        type="button"
                                        className={s.row}
                                        data-current={
                                            n.id === nodeId || undefined
                                        }
                                        onClick={() => go(n.id)}
                                    >
                                        <span>
                                            {n.kind === "level"
                                                ? String(n.level).padStart(
                                                      2,
                                                      "0",
                                                  )
                                                : "··"}
                                        </span>
                                        <span>{n.title}</span>
                                    </button>
                                ))}
                            </section>
                        ))}
                    </div>
                    <p className={s.note}>
                        Alt+Shift+S решает текущий уровень.
                    </p>
                </div>
            )}
        </div>
    );
}

export default function DevJump() {
    return DEV_TOOLS ? <Panel /> : null;
}
