import { useEffect } from "react";
import { DEV_TOOLS, devSolve } from "@/game/dev";

export function useDevKeys() {
    useEffect(() => {
        if (!DEV_TOOLS) return;

        const onKey = (e) => {
            if (e.altKey && e.shiftKey && e.code === "KeyS") {
                e.preventDefault();
                devSolve();
            }
        };

        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);
}
