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

function Burst({ decay }) {
    const bars = useMemo(
        () =>
            Array.from({ length: 2 + Math.round(decay * 3) }, () => ({
                top: 4 + Math.random() * 92,
                h: 2 + Math.random() * 5,
                dx: (Math.random() - 0.5) * 8,
            })),
        [decay],
    );

    const tile = useMemo(
        () =>
            decay >= 0.4 && Math.random() < 0.6
                ? {
                      x:
                          Math.random() < 0.5
                              ? 2 + Math.random() * 8
                              : 84 + Math.random() * 10,
                      y: 14 + Math.random() * 66,
                  }
                : null,
        [decay],
    );

    return (
        <>
            <i className={s.flash} />
            {bars.map((b, i) => (
                <i
                    key={i}
                    className={s.tear}
                    style={{
                        top: `${b.top}%`,
                        height: `${b.h}px`,
                        "--dx": `${b.dx}%`,
                    }}
                />
            ))}
            {tile && (
                <i
                    className={s.tile}
                    style={{ left: `${tile.x}%`, top: `${tile.y}%` }}
                />
            )}
        </>
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
            {glitch && <Burst key={glitch.id} decay={decay} />}
        </div>
    );
}
