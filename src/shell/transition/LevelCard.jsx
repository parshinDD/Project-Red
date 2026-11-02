import { motion } from "motion/react";
import { ACTS, pad2 } from "@/game/flow/nodes";
import { TOTAL_SHARDS } from "@/game/constants";
import { TIMING, LEVEL_CUES } from "@/game/flow/timing";
import { EASE_OUT } from "./ease";
import ModuleRail from "./ModuleRail";
import Odometer from "./Odometer";
import s from "./transition.module.css";

export default function LevelCard({ card, reduce }) {
    const { cover } = TIMING.level;

    const act = ACTS[card.act];
    const sec = (ms) => (cover + ms) / 1000;

    const slide = (delay) => ({
        initial: {
            opacity: 0,
            transform: reduce ? "translateX(0px)" : "translateX(-18px)",
        },
        animate: {
            opacity: 1,
            transform: "translateX(0px)",
            transition: { delay, duration: 0.26, ease: EASE_OUT },
        },
    });

    return (
        <motion.div
            className={`${s.card} ${s.levelCard}`}
            initial={{ opacity: 0 }}
            animate={{
                opacity: 1,
                transition: { delay: (cover * 0.6) / 1000, duration: 0.16 },
            }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
        >
            <ModuleRail
                current={card.level}
                delay={cover + LEVEL_CUES.roll}
                caption={`${pad2(card.level)} / ${pad2(TOTAL_SHARDS)}`}
            />

            <div className={s.levelBody}>
                <Odometer
                    from={card.fromLevel}
                    to={card.level}
                    delay={sec(LEVEL_CUES.roll)}
                    duration={LEVEL_CUES.rollMs / 1000}
                    reduce={reduce}
                />
                <div className={s.levelMeta}>
                    <motion.h2 className={s.levelTitle} {...slide(sec(60))}>
                        {card.title}
                    </motion.h2>
                    <motion.p className={s.levelAct} {...slide(sec(120))}>
                        ACT {act.roman} · {act.name}
                    </motion.p>
                </div>
            </div>

            <p className={s.mount} aria-hidden="true">
                <span>mount level_{pad2(card.level)}.sh</span>
                <i className={s.leader} />
                <motion.b
                    className={s.ok}
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: 1,
                        transition: {
                            delay: sec(LEVEL_CUES.ok),
                            duration: 0.001,
                        },
                    }}
                >
                    OK
                </motion.b>
            </p>
        </motion.div>
    );
}
