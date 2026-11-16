import { useEffect } from "react";
import { useUiStore } from "@/store/uiStore";
import { useGameStore } from "@/store/gameStore";
import { duckAudio, play, setAudioDecay } from "@/audio/audioEngine";

let seq = 0;
let lagSeq = 0;

export const LAG_FROM = 0.4;
export const LAG_INPUT_FROM = 0.72;

export function fireLag(ms) {
    const ui = useUiStore.getState();

    if (ui.decay < LAG_FROM || ui.lag) return 0;

    const dur =
        ms ?? Math.round(140 + 520 * ui.decay * (0.5 + Math.random() * 0.5));

    ui.setLag({ id: ++lagSeq, dur, until: performance.now() + dur });
    duckAudio(dur);

    setTimeout(() => useUiStore.getState().setLag(null), dur);

    return dur;
}

export function fireGlitch(kind = "idle") {
    const ui = useUiStore.getState();

    if (ui.decay <= 0 || ui.glitch) return;

    const dur = Math.round(240 + 420 * ui.decay + Math.random() * 160);
    ui.setGlitch({ id: ++seq, kind, dur });
    play("decayBurst", { amt: ui.decay });

    setTimeout(() => useUiStore.getState().setGlitch(null), dur);
}

export function useDecay(decay) {
    const nodeId = useGameStore((st) => st.nodeId);

    useEffect(() => {
        useUiStore.getState().setDecay(decay);
        setAudioDecay(decay);

        if (decay <= 0) useUiStore.getState().setGlitch(null);
    }, [decay]);

    useEffect(() => {
        if (decay <= 0) return undefined;

        let timer;
        const schedule = () => {
            const base = 26000 - 18000 * decay;

            timer = setTimeout(
                () => {
                    fireGlitch("idle");
                    schedule();
                },

                base * (0.6 + Math.random() * 0.8),
            );
        };

        schedule();
        const unsub = useUiStore.subscribe((now, before) => {
            if (now.hpHit !== before.hpHit) {
                fireGlitch("hit");
            } else if (now.shardDrop && !before.shardDrop) {
                fireGlitch("shard");
            }
        });

        return () => {
            clearTimeout(timer);
            unsub();
        };
    }, [decay]);

    useEffect(() => {
        if (decay <= 0) return undefined;

        const t = setTimeout(() => fireGlitch("enter"), 1100);

        return () => clearTimeout(t);
    }, [nodeId, decay]);
}

export function useLag(decay) {
    useEffect(() => {
        if (decay < LAG_FROM) return undefined;

        let timer;
        let second;
        const schedule = () => {
            const base = 42000 - 36000 * decay;

            timer = setTimeout(
                () => {
                    const dur = fireLag();

                    if (dur && decay >= 0.84 && Math.random() < 0.45)
                        second = setTimeout(
                            () => fireLag(),
                            dur + 160 + Math.random() * 260,
                        );

                    schedule();
                },
                base * (0.6 + Math.random() * 0.8),
            );
        };

        schedule();

        return () => {
            clearTimeout(timer);
            clearTimeout(second);
        };
    }, [decay]);

    useEffect(() => {
        if (decay < LAG_INPUT_FROM) return undefined;

        let replaying = false;

        const onClick = (e) => {
            if (replaying) return;

            const lag = useUiStore.getState().lag;
            const btn =
                e.target instanceof Element
                    ? e.target.closest("button:not(:disabled)")
                    : null;

            if (!lag || !btn) return;

            e.preventDefault();
            e.stopImmediatePropagation();

            setTimeout(
                () => {
                    if (!btn.isConnected) return;

                    replaying = true;
                    btn.click();
                    replaying = false;
                },

                Math.max(0, lag.until - performance.now()) + 40,
            );
        };

        document.addEventListener("click", onClick, true);

        return () => document.removeEventListener("click", onClick, true);
    }, [decay]);
}
