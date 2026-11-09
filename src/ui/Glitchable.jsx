import { useId, useMemo } from "react";
import { useUiStore } from "@/store/uiStore";

const fit = (to, n) => (to.length >= n ? to.slice(0, n) : to.padEnd(n));

function roll(key) {
    let h = 2166136261;
    for (let i = 0; i < key.length; i++)
        h = Math.imul(h ^ key.charCodeAt(i), 16777619);

    return ((h >>> 0) % 1000) / 1000;
}

export default function Glitchable({
    children,
    swaps = [],
    className,
    as: Tag = "span",
}) {
    const text = String(children);
    const id = useId();
    const decay = useUiStore((st) => st.decay);
    const glitch = useUiStore((st) => st.glitch);

    const shown = useMemo(() => {
        if (!glitch || decay <= 0) return text;

        let out = text;
        for (const [from, to] of swaps) {
            if (
                out.includes(from) &&
                roll(`${id}:${glitch.id}:${from}`) < 0.3 + 0.5 * decay
            )
                out = out.replace(from, fit(to, from.length));
        }

        return out;
    }, [text, swaps, glitch, decay, id]);

    if (decay <= 0) return <Tag className={className}>{text}</Tag>;

    return (
        <Tag className={className}>
            <span className="srOnly">{text}</span>
            <span aria-hidden="true" style={{ whiteSpace: "pre" }}>
                {shown}
            </span>
        </Tag>
    );
}
