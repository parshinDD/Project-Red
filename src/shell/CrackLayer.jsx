import { useUiStore } from "@/store/uiStore";
import s from "./decay.module.css";

const WEBS = [
    { corner: "tl", min: 0.25, k: 115, ox: 9, oy: 10 },
    { corner: "br", min: 0.42, k: 150, ox: 90, oy: 91 },
    { corner: "tr", min: 0.65, k: 240, ox: 91, oy: 11 },
    { corner: "bl", min: 0.8, k: 420, ox: 10, oy: 90 },
];

if (typeof window !== "undefined") {
    const warm = () =>
        WEBS.forEach((w) => {
            new Image().src = `/decay/crack-${w.corner}.webp`;
        });
    (window.requestIdleCallback ?? ((fn) => setTimeout(fn, 4000)))(warm);
}

export default function CrackLayer() {
    const decay = useUiStore((st) => st.decay);
    if (decay <= 0) return null;

    return (
        <div className={s.cracks} style={{ "--d": decay }} aria-hidden="true">
            {WEBS.filter((w) => decay > w.min).map((w) => (
                <img
                    key={w.corner}
                    className={s.web}
                    data-pos={w.corner}
                    src={`/decay/crack-${w.corner}.webp`}
                    alt=""
                    draggable="false"
                    decoding="async"
                    style={{
                        "--min": w.min,
                        "--k": `${w.k}%`,
                        "--ox": `${w.ox}%`,
                        "--oy": `${w.oy}%`,
                    }}
                />
            ))}
        </div>
    );
}
