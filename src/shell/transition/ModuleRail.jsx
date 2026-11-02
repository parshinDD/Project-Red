import { LEVELS, ACTS } from "@/game/flow/nodes";
import s from "./transition.module.css";

const GROUPS = [...new Set(LEVELS.map((l) => l.act))].map((act) => ({
    act,
    roman: ACTS[act].roman,
    levels: LEVELS.filter((l) => l.act === act),
}));

export default function ModuleRail({
    current,
    lightAct = null,
    delay = 0,
    step = 130,
    caption,
}) {
    const activeAct = lightAct ?? LEVELS.find((l) => l.level === current)?.act;
    return (
        <div className={s.rail} role="img" aria-label={caption}>
            {GROUPS.map((g) => (
                <div
                    key={g.act}
                    className={s.railGroup}
                    data-active={g.act === activeAct ? "" : undefined}
                >
                    <span className={s.railAct} aria-hidden="true">
                        {g.roman}
                    </span>
                    <div className={s.railCells}>
                        {g.levels.map((l, i) => {
                            const lit = lightAct != null && l.act === lightAct;
                            let state = "idle";
                            if (lit) state = "lit";
                            else if (l.level < current) state = "done";
                            else if (l.level === current && lightAct == null)
                                state = "now";
                            return (
                                <i
                                    key={l.level}
                                    className={s.cell}
                                    data-state={state}
                                    style={{
                                        "--d": `${delay + (lit ? i * step : 0)}ms`,
                                    }}
                                />
                            );
                        })}
                    </div>
                </div>
            ))}
            <span className={s.railCount} aria-hidden="true">
                {caption}
            </span>
        </div>
    );
}
