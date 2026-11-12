import { useEffect } from "react";
import { useUiStore } from "@/store/uiStore";
import { useGameStore } from "@/store/gameStore";
import { play, setAudioDecay } from "@/audio/audioEngine";

let seq = 0;

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
            if (now.hpHit !== before.hpHit) fireGlitch("hit");
            else if (now.shardDrop && !before.shardDrop) fireGlitch("shard");
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
