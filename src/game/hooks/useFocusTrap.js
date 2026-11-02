import { useEffect } from "react";

const FOCUSABLE =
    'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])';

export function useFocusTrap(ref) {
    useEffect(() => {
        const root = ref.current;
        if (!root) return;

        const previous = document.activeElement;
        root.querySelector(FOCUSABLE)?.focus();

        const onKey = (e) => {
            if (e.key !== "Tab") return;

            const items = [...root.querySelectorAll(FOCUSABLE)];
            if (!items.length) return;

            const first = items[0];
            const last = items[items.length - 1];

            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        };

        root.addEventListener("keydown", onKey);

        return () => {
            root.removeEventListener("keydown", onKey);
            if (previous instanceof HTMLElement) previous.focus();
        };
    }, [ref]);
}
