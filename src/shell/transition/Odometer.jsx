import { motion } from "motion/react";
import { pad2 } from "@/game/flow/nodes";
import { EASE_IN_OUT } from "./ease";
import s from "./transition.module.css";

function Digit({ from, to, delay, duration, reduce }) {
    if (from === to || reduce) {
        return (
            <span className={s.digit}>
                <span className={s.digitStatic}>{to}</span>
            </span>
        );
    }

    return (
        <span className={s.digit}>
            <motion.span
                className={s.digitCol}
                initial={{ transform: "translateY(0%)" }}
                animate={{
                    transform: "translateY(-50%)",
                    transition: { delay, duration, ease: EASE_IN_OUT },
                }}
            >
                <span>{from}</span>
                <span>{to}</span>
            </motion.span>
        </span>
    );
}

export default function Odometer({ from, to, delay, duration, reduce }) {
    const a = pad2(from);
    const b = pad2(to);

    return (
        <span className={s.odo}>
            <span className="srOnly">Level {b}</span>
            <span className={s.odoDigits} aria-hidden="true">
                {[0, 1].map((i) => (
                    <Digit
                        key={i}
                        from={a[i]}
                        to={b[i]}
                        delay={delay}
                        duration={duration}
                        reduce={reduce}
                    />
                ))}
            </span>
        </span>
    );
}
