import { useEffect, useRef, useState } from "react";

export function useReveal(
    delays,
    { skip = false, paused = false, onDone } = {},
) {
    const [shown, setShown] = useState(0);
    const doneRef = useRef(onDone);
    doneRef.current = onDone;

    useEffect(() => {
        if (paused || shown >= delays.length) return;

        if (skip) {
            setShown(delays.length);
            return;
        }

        const id = setTimeout(() => setShown((n) => n + 1), delays[shown]);
        return () => clearTimeout(id);
    }, [shown, skip, paused, delays]);

    const finished = delays.length > 0 && shown >= delays.length;

    useEffect(() => {
        if (finished) doneRef.current?.();
    }, [finished]);

    return shown;
}
