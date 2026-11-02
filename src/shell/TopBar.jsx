import { useRef } from "react";
import { useUiStore } from "@/store/uiStore";
import { nodeLabel } from "@/game/flow/nodes";
import { grantAchievement, grantJournal } from "@/game/rewards";
import HpMeter from "./HpMeter";
import ShardMeter from "./ShardMeter";
import s from "./shell.module.css";

export default function TopBar({ node }) {
    const journalOpen = useUiStore((st) => st.journalOpen);
    const toggleJournal = useUiStore((st) => st.toggleJournal);

    const clicks = useRef({ n: 0, t: 0 });
    const intro = node.kind === "prologue";

    const poke = () => {
        const now = Date.now();
        const c = clicks.current;

        c.n = now - c.t > 4000 ? 1 : c.n + 1;
        c.t = now;

        if (c.n >= 5) {
            c.n = 0;
            useUiStore
                .getState()
                .pushMessage(
                    "ACCESS DENIED: /debug is not a public route.",
                    "err",
                );

            grantJournal("backdoor");
            grantAchievement("backdoor-tourist");
        }
    };

    const label = nodeLabel(node);

    return (
        <header className={s.top}>
            <div className={`${s.inner} ${s.topInner}`}>
                <button
                    type="button"
                    className={s.build}
                    onClick={poke}
                    aria-label="Build identifier"
                >
                    <span className={s.buildName}>
                        PROJECT <b>RED</b>
                    </span>
                    <span className={s.buildId}>BUILD_02-12</span>
                </button>
                <p className={s.where} aria-live="polite">
                    {label}
                </p>
                <div className={s.hud} data-hidden={intro} inert={intro}>
                    <HpMeter />
                    <ShardMeter />
                    <button
                        type="button"
                        className={s.tabBtn}
                        onClick={toggleJournal}
                        aria-expanded={journalOpen}
                    >
                        Journal<kbd>[J]</kbd>
                    </button>
                </div>
            </div>
        </header>
    );
}
