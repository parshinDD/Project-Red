import { play, duckAmbience } from "@/audio/audioEngine";
import {
    TIMING,
    LEVEL_CUES,
    ACT_CUES,
    TITLE_FLICKER,
} from "@/game/flow/timing";
import { levelsOfAct } from "@/game/flow/nodes";

export function cueTransition(tr) {
    const timers = [];
    const at = (ms, fn) => timers.push(setTimeout(fn, ms));

    if (tr.kind === "fade") {
        play("blip");
    } else if (tr.kind === "level") {
        const c = TIMING.level.cover;

        play("doorsClose");
        at(c + LEVEL_CUES.roll, () => play("ratchet"));
        at(c + LEVEL_CUES.ok, () => play("mountOk"));
    } else if (tr.kind === "act") {
        const c = TIMING.act.cover;
        const act = tr.card?.act;

        play("powerDown");
        duckAmbience(0.12, 0.05);

        const { ms, keys } = TITLE_FLICKER;
        at(c + ACT_CUES.title, () => play("flickerBuzz", { keys, ms }));

        keys.forEach(([o, v], i) => {
            const step = i > 0 ? v - keys[i - 1][1] : 0;
            if (Math.abs(step) >= 0.3) {
                at(c + ACT_CUES.title + o * ms, () =>
                    play("lampPop", {
                        kind: step > 0 ? "strike" : "drop",
                        amt: Math.min(1, Math.abs(step)),
                    }),
                );
            }
        });

        at(c + ACT_CUES.name, () => play(`sting${act}`));
        levelsOfAct(act).forEach((_, i) =>
            at(c + ACT_CUES.roster + i * ACT_CUES.rosterStep, () =>
                play("rackOn", { index: i }),
            ),
        );

        for (let i = 0; i < 3; i++)
            at(c + ACT_CUES.log + i * ACT_CUES.logStep, () => play("tick"));
    }

    return () => {
        timers.forEach(clearTimeout);
        if (tr.kind === "act") duckAmbience(1, 0.5);
    };
}

export function cueTransitionExit(tr) {
    if (tr.kind === "level") play("doorsOpen");
    else if (tr.kind === "act") play("powerUp");
}
