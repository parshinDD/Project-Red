import { useLayoutEffect } from "react";

export function useFlicker(ref, { ms, keys }, delayMs, off = false) {
    useLayoutEffect(() => {
        const el = ref.current;
        if (!el) return undefined;

        if (off || !el.animate) {
            el.style.opacity = "1";
            return undefined;
        }

        const anim = el.animate(
            keys.map(([offset, opacity]) => ({
                offset,
                opacity,
                easing: "steps(1, end)",
            })),
            { duration: ms, delay: delayMs, fill: "both" },
        );

        return () => anim.cancel();
    }, [ref, ms, keys, delayMs, off]);
}
