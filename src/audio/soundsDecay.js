import { tone, noise } from "./synthKit";

export const DECAY_SFX = {
    decayBurst: (c, d, { amt = 0.5, delay = 0 } = {}) => {
        noise(c, d, { dur: 0.07, gain: 0.04 * (0.5 + amt), hp: 1800, delay });

        tone(c, d, {
            freq: 3200,
            to: 180,
            type: "square",
            dur: 0.11,
            gain: 0.014 + 0.018 * amt,
            delay,
        });

        noise(c, d, {
            dur: 0.05,
            gain: 0.035 * amt,
            hp: 600,
            lp: 2500,
            delay: delay + 0.12,
        });
    },
};
