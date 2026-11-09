import { tone, noise, sweepNoise, thump, relayClack } from "./synthKit";

export const ACT2_SFX = {
    lightGreen: (c, d, { delay = 0 } = {}) => {
        relayClack(c, d, { delay });
        tone(c, d, {
            freq: 520,
            to: 780,
            type: "sine",
            dur: 0.14,
            gain: 0.05,
            delay: delay + 0.02,
        });
    },

    lightRed: (c, d, { delay = 0 } = {}) => {
        relayClack(c, d, { delay });
        tone(c, d, {
            freq: 150,
            to: 138,
            type: "sawtooth",
            dur: 0.36,
            gain: 0.05,
            attack: 0.02,
            delay: delay + 0.02,
        });
        tone(c, d, {
            freq: 226,
            to: 210,
            type: "square",
            dur: 0.3,
            gain: 0.018,
            attack: 0.02,
            delay: delay + 0.02,
        });
    },

    step: (c, d, { foot = 0, delay = 0 } = {}) => {
        thump(c, d, {
            freq: foot ? 118 : 100,
            to: 62,
            dur: 0.07,
            gain: 0.07,
            delay,
        });
        noise(c, d, { dur: 0.03, gain: 0.035, hp: 500, lp: 2600, delay });
    },

    glassTap: (c, d, { side = "L", delay = 0 } = {}) => {
        const f = side === "L" ? 1760 : 2093;
        tone(c, d, { freq: f, type: "sine", dur: 0.16, gain: 0.04, delay });
        tone(c, d, {
            freq: f * 1.5,
            type: "sine",
            dur: 0.1,
            gain: 0.02,
            delay,
        });
        noise(c, d, { dur: 0.012, gain: 0.025, hp: 3500, delay });
    },

    glassStep: (c, d, { index = 0, delay = 0 } = {}) => {
        tone(c, d, {
            freq: 523 * 2 ** (index / 6),
            type: "triangle",
            dur: 0.14,
            gain: 0.05,
            delay,
        });
        thump(c, d, { freq: 140, to: 80, dur: 0.06, gain: 0.05, delay });
    },

    glassCrack: (c, d, { delay = 0 } = {}) => {
        noise(c, d, { dur: 0.05, gain: 0.12, hp: 2500, delay });
        [0.05, 0.09, 0.15, 0.24, 0.31, 0.42].forEach((t, i) =>
            tone(c, d, {
                freq: 3400 - i * 380,
                to: 1500,
                type: "sine",
                dur: 0.05,
                gain: 0.03,
                delay: delay + t,
            }),
        );
        sweepNoise(c, d, {
            from: 4200,
            to: 600,
            dur: 0.6,
            gain: 0.05,
            delay: delay + 0.06,
        });
        thump(c, d, {
            freq: 90,
            to: 36,
            dur: 0.3,
            gain: 0.14,
            delay: delay + 0.04,
        });
    },

    anomaly: (c, d, { delay = 0 } = {}) => {
        tone(c, d, {
            freq: 880,
            to: 1320,
            type: "sine",
            dur: 0.4,
            gain: 0.04,
            attack: 0.1,
            delay,
        });
        tone(c, d, {
            freq: 893,
            to: 1290,
            type: "sine",
            dur: 0.4,
            gain: 0.03,
            attack: 0.1,
            delay,
        });
        noise(c, d, { dur: 0.2, gain: 0.02, hp: 5000, delay: delay + 0.1 });
    },

    stamp: (c, d, { delay = 0 } = {}) => {
        thump(c, d, { freq: 150, to: 50, dur: 0.2, gain: 0.2, delay });
        noise(c, d, { dur: 0.07, gain: 0.08, hp: 250, lp: 5000, delay });
    },

    unstamp: (c, d, { delay = 0 } = {}) => {
        noise(c, d, { dur: 0.08, gain: 0.04, hp: 1800, lp: 6000, delay });
    },

    paper: (c, d, { delay = 0 } = {}) => {
        sweepNoise(c, d, {
            from: 2500,
            to: 6500,
            dur: 0.12,
            gain: 0.03,
            q: 0.8,
            delay,
        });
    },
};
