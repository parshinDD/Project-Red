import { useEffect, useRef, useState } from "react";
import { TermLine, TermGap, TermLeader } from "./Terminal";
import ProgressBar from "./ProgressBar";

function Step({ onDone, ms = 0, children }) {
    useEffect(() => {
        const id = setTimeout(() => onDone?.(), ms);

        return () => clearTimeout(id);
    }, []);
    return children;
}

export default function TypedBlock({ items, instant = false, onDone, onItem }) {
    const [shown, setShown] = useState(0);

    const timers = useRef([]);
    const doneRef = useRef(onDone);
    const itemRef = useRef(onItem);
    const instantRef = useRef(instant);
    const finished = useRef(false);

    doneRef.current = onDone;
    itemRef.current = onItem;
    instantRef.current = instant;

    const finish = () => {
        if (finished.current) return;

        finished.current = true;
        doneRef.current?.();
    };

    const schedule = (i) => {
        if (instantRef.current) return;

        if (i >= items.length) {
            finish();
            return;
        }

        timers.current.push(
            setTimeout(() => setShown(i + 1), items[i].delay ?? 260),
        );
    };

    useEffect(() => {
        if (instant) return;

        schedule(0);
        return () => {
            timers.current.forEach(clearTimeout);
            timers.current = [];
        };
    }, []);

    useEffect(() => {
        if (!instant) return;

        timers.current.forEach(clearTimeout);
        setShown(items.length);

        finish();
    }, [instant]);

    useEffect(() => {
        if (shown > 0) itemRef.current?.(shown - 1);
    }, [shown]);

    return items.slice(0, shown).map((item, i) => {
        const next = () => schedule(i + 1);

        if (item.k === "gap")
            return (
                <Step key={i} onDone={next}>
                    <TermGap />
                </Step>
            );

        if (item.k === "leader") {
            return (
                <Step key={i} ms={380} onDone={next}>
                    <TermLeader
                        label={item.label}
                        status={item.status}
                        tone={item.tone}
                    />
                </Step>
            );
        }

        if (item.k === "bar") {
            return (
                <ProgressBar
                    key={i}
                    sequence={[{ to: 100, duration: item.duration ?? 0.9 }]}
                    skip={instant}
                    restAt={100}
                    onDone={next}
                    label="Working"
                />
            );
        }

        return (
            <TermLine
                key={i}
                text={item.text}
                tone={item.tone}
                as={item.as}
                glitch={item.glitch}
                fast={item.fast}
                instant={instant}
                onDone={next}
            />
        );
    });
}
