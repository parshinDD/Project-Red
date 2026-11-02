import { useEffect, useRef } from "react";
import {
    animate,
    useMotionValue,
    useMotionValueEvent,
    useTransform,
    motion,
} from "motion/react";
import s from "./progress.module.css";

const CELLS = 36;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function ProgressBar({
    sequence,
    onDone,
    paused = false,
    skip = false,
    restAt = 0,
    label = "Loading",
}) {
    const value = useMotionValue(0);

    const clip = useTransform(
        value,
        (v) =>
            `inset(0 ${(100 - (Math.round((v / 100) * CELLS) / CELLS) * 100).toFixed(2)}% 0 0)`,
    );

    const text = useRef(null);
    const doneRef = useRef(onDone);

    doneRef.current = onDone;

    useMotionValueEvent(value, "change", (v) => {
        if (text.current) text.current.textContent = `${Math.round(v)}%`;
    });

    useEffect(() => {
        if (paused) return;

        if (skip) {
            value.set(restAt);
            doneRef.current?.();
            return;
        }

        let cancelled = false;
        let controls = null;

        value.set(0);
        (async () => {
            for (const step of sequence) {
                if (cancelled) return;

                if (step.hold) {
                    await sleep(step.hold * 1000);
                } else {
                    controls = animate(value, step.to, {
                        duration: step.duration,
                        ease: "easeInOut",
                    });

                    await controls;
                }
            }

            if (!cancelled) doneRef.current?.();
        })();

        return () => {
            cancelled = true;
            controls?.stop();
        };
    }, [paused, skip]);

    return (
        <div className={s.wrap} role="progressbar" aria-label={label}>
            <div className={s.track}>
                <motion.div className={s.fill} style={{ clipPath: clip }} />
            </div>
            <span ref={text} className={s.value}>
                0%
            </span>
        </div>
    );
}
