import { tone, noise, sweepNoise, thump } from "./synthKit";

export const ACT3_SFX = {
    statUp: (c, d, { delay = 0 } = {}) =>
        tone(c, d, {
            freq: 520,
            to: 700,
            type: "sine",
            dur: 0.1,
            gain: 0.05,
            delay,
        }),
    statDown: (c, d, { delay = 0 } = {}) =>
        tone(c, d, {
            freq: 400,
            to: 280,
            type: "sine",
            dur: 0.1,
            gain: 0.05,
            delay,
        }),
    trialPass: (c, d, { delay = 0 } = {}) => {
        tone(c, d, { freq: 784, type: "sine", dur: 0.3, gain: 0.05, delay });
        tone(c, d, {
            freq: 1175,
            type: "sine",
            dur: 0.4,
            gain: 0.04,
            delay: delay + 0.1,
        });
    },
    trialFail: (c, d, { delay = 0 } = {}) => {
        thump(c, d, { freq: 120, to: 50, dur: 0.5, gain: 0.18, delay });
        tone(c, d, {
            freq: 165,
            type: "triangle",
            dur: 0.5,
            gain: 0.05,
            delay,
        });
    },
    cardFlip: (c, d, { delay = 0 } = {}) =>
        sweepNoise(c, d, {
            from: 1500,
            to: 5500,
            dur: 0.12,
            gain: 0.04,
            delay,
        }),
    mugClink: (c, d, { delay = 0 } = {}) => {
        noise(c, d, { dur: 0.01, gain: 0.04, hp: 3000, delay });
        tone(c, d, { freq: 2300, type: "sine", dur: 0.2, gain: 0.03, delay });
    },
    memoryIndex: (c, d, { delay = 0 } = {}) => {
        [988, 1319, 1760].forEach((f, i) =>
            tone(c, d, {
                freq: f,
                type: "sine",
                dur: 0.6,
                gain: 0.04,
                delay: delay + i * 0.11,
            }),
        );
    },
};
