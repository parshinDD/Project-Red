import { useEffect, useRef } from "react";

export function useHotkeys(map) {
    const ref = useRef(map);
    ref.current = map;

    useEffect(() => {
        const onKey = (e) => {
            if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;

            const t = e.target;
            const typing =
                t instanceof HTMLElement &&
                (t.tagName === "INPUT" ||
                    t.tagName === "TEXTAREA" ||
                    t.isContentEditable);

            const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
            if (typing && key !== "Escape") return;

            ref.current[key]?.(e);
        };

        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);
}
