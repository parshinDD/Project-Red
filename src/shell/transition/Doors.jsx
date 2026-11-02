import { motion } from "motion/react";
import { TIMING } from "@/game/flow/timing";
import { EASE_OUT, EASE_IN_OUT } from "./ease";
import s from "./transition.module.css";

export default function Doors({ kind, reduce }) {
    const T = TIMING[kind];
    const enter = { duration: T.cover / 1000, ease: EASE_OUT };

    if (kind === "fade" || reduce) {
        return (
            <motion.div
                className={s.black}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: enter }}
                exit={{
                    opacity: 0,
                    transition: { duration: T.exit / 1000, ease: EASE_OUT },
                }}
            />
        );
    }

    const act = kind === "act";
    const leave = act
        ? { duration: T.exit / 1000, ease: EASE_IN_OUT, delay: 0.1 }
        : { duration: T.exit / 1000, ease: EASE_OUT };

    const leaf = (cls, from, to) => (
        <motion.div
            className={`${s.leaf} ${cls}`}
            initial={{ transform: from }}
            animate={{
                transform: to,
                transition: act ? { ...enter, duration: 0.18 } : enter,
            }}
            exit={{ transform: from, transition: leave }}
        />
    );

    if (!act) {
        return (
            <>
                {leaf(s.leafL, "translateX(-100%)", "translateX(0%)")}
                {leaf(s.leafR, "translateX(100%)", "translateX(0%)")}
                <motion.i
                    className={s.seam}
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: 1,
                        transition: {
                            delay: (T.cover * 0.7) / 1000,
                            duration: 0.1,
                        },
                    }}
                    exit={{ opacity: 0, transition: { duration: 0.08 } }}
                />
            </>
        );
    }

    return (
        <>
            {leaf(s.leafT, "translateY(-100%)", "translateY(0%)")}
            {leaf(s.leafB, "translateY(100%)", "translateY(0%)")}
            <i className={s.glow} />
            <motion.i
                className={s.beam}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0 }}
                exit={{
                    opacity: [0, 1, 1, 0],
                    scaleX: [0.02, 1, 1, 1],
                    scaleY: [1, 1, 3, 9],
                    transition: {
                        duration: T.exit / 1000,
                        times: [0, 0.2, 0.55, 1],
                        ease: "linear",
                    },
                }}
            />
        </>
    );
}
