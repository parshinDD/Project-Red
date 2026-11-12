import { useEffect, useMemo, useState } from "react";
import { useUiStore } from "@/store/uiStore";
import s from "./decay.module.css";

const GHOSTS = ["02-12", "RECOVERY", "NOT FOUND", "1%"];
const SPOTS = ["tr", "bl", "br", "tl"];

function Ghost() {
    const [i, setI] = useState(0);

    useEffect(() => {
        const id = setInterval(() => setI((n) => n + 1), 15000);

        return () => clearInterval(id);
    }, []);

    return (
        <b key={i} className={s.ghost} data-spot={SPOTS[i % SPOTS.length]}>
            {GHOSTS[i % GHOSTS.length]}
        </b>
    );
}

const rnd = (a, b) => a + Math.random() * (b - a);

const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;

function Burst({ decay, dur }) {
    const bars = useMemo(() => {
        const center = rnd(10, 90);
        const count = 3 + Math.round(decay * 4);

        return Array.from({ length: count }, (_, i) => {
            const outlier = i === count - 1 && Math.random() < 0.5;
            const top = outlier
                ? rnd(4, 96)
                : Math.min(97, Math.max(2, center + gauss() * 13));

            return {
                top,
                h: rnd(2, 5) + (Math.random() < 0.25 ? rnd(6, 12) : 0),
                dx: (Math.random() < 0.5 ? -1 : 1) * rnd(0.6, 3.2 + decay * 3),
                left: Math.random() < 0.6 ? 0 : rnd(0, 35),
                width: Math.random() < 0.6 ? 100 : rnd(45, 90),
                delay: rnd(0, 0.28) * dur,
                span: rnd(0.45, 0.8) * dur,
                a: rnd(0.45, 1),
            };
        });
    }, [decay, dur]);

    const blocks = useMemo(
        () =>
            decay >= 0.35 && Math.random() < 0.65
                ? Array.from(
                      { length: 2 + Math.round(Math.random() * 2) },
                      () => ({
                          x: rnd(3, 92),
                          y: rnd(12, 82),
                          w: rnd(2.5, 7),
                          h: rnd(1.4, 3.2),
                          delay: rnd(0, 0.35) * dur,
                      }),
                  )
                : [],
        [decay, dur],
    );

    const roll = useMemo(() => Math.random() < 0.55, []);

    return (
        <div className={s.burst} style={{ "--dur": `${dur}ms` }}>
            <i className={s.flash} />
            <i className={s.grain} />
            {roll && <i className={s.roll} />}
            {bars.map((b, i) => (
                <i
                    key={i}
                    className={s.tear}
                    style={{
                        top: `${b.top}%`,
                        height: `${b.h}px`,
                        left: `${b.left}%`,
                        width: `${b.width}%`,
                        "--dx": `${b.dx}%`,
                        "--a": b.a,
                        "--delay": `${b.delay}ms`,
                        "--span": `${b.span}ms`,
                    }}
                />
            ))}
            {blocks.map((k, i) => (
                <i
                    key={i}
                    className={s.block}
                    style={{
                        left: `${k.x}%`,
                        top: `${k.y}%`,
                        width: `${k.w}vw`,
                        height: `${k.h}vh`,
                        "--delay": `${k.delay}ms`,
                    }}
                />
            ))}
        </div>
    );
}

export default function DecayLayer() {
    const decay = useUiStore((st) => st.decay);
    const glitch = useUiStore((st) => st.glitch);

    if (decay <= 0) return null;

    return (
        <div className={s.layer} style={{ "--d": decay }} aria-hidden="true">
            <i className={s.wear} />
            <Ghost />
            {glitch && (
                <Burst key={glitch.id} decay={decay} dur={glitch.dur ?? 500} />
            )}
        </div>
    );
}
