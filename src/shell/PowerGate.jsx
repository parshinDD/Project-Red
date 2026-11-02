import { useEffect } from "react";
import { initAudio, play } from "@/audio/audioEngine";
import { BUILD_NAME } from "@/game/constants";
import s from "./powerGate.module.css";

const IGNORED = new Set([
    "Shift",
    "Control",
    "Alt",
    "Meta",
    "CapsLock",
    "Tab",
    "Escape",
]);

export default function PowerGate({ onStart }) {
    useEffect(() => {
        let done = false;

        const start = (e) => {
            if (
                done ||
                (e.type === "keydown" &&
                    (IGNORED.has(e.key) || e.metaKey || e.ctrlKey || e.altKey))
            )
                return;

            done = true;
            if (e.type === "keydown") e.preventDefault();

            initAudio();
            play("relay");
            onStart();
        };

        window.addEventListener("keydown", start);
        window.addEventListener("pointerdown", start);

        return () => {
            window.removeEventListener("keydown", start);
            window.removeEventListener("pointerdown", start);
        };
    }, [onStart]);

    return (
        <div className={s.gate} role="status">
            <i className={s.led} aria-hidden="true" />
            <p className={s.prompt}>PRESS ANY KEY</p>
            <p className={s.hint}>{BUILD_NAME} · best with sound</p>
        </div>
    );
}
