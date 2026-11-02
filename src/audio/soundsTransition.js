import { tone, noise, sweepNoise, thump, relayClack } from "./synthKit";

const TRIAD = [1, 1.26, 1.498];

export const TRANSITION_SFX = {
    doorsClose: (c, d, { delay = 0 } = {}) => {
        sweepNoise(c, d, { from: 2600, to: 420, dur: 0.26, gain: 0.06, delay });
        thump(c, d, {
            freq: 120,
            to: 48,
            dur: 0.18,
            gain: 0.17,
            delay: delay + 0.2,
        });
        noise(c, d, { dur: 0.02, gain: 0.05, hp: 700, delay: delay + 0.2 });
    },

    doorsOpen: (c, d, { delay = 0 } = {}) => {
        relayClack(c, d, { delay, gain: 0.045 });
        sweepNoise(c, d, {
            from: 450,
            to: 2800,
            dur: 0.3,
            gain: 0.04,
            delay: delay + 0.02,
        });
        thump(c, d, { freq: 90, to: 50, dur: 0.12, gain: 0.07, delay });
    },

    ratchet: (c, d, { delay = 0 } = {}) => {
        [0, 0.04, 0.085, 0.135, 0.195, 0.268, 0.36].forEach((t, i) =>
            tone(c, d, {
                freq: 1600 - i * 70,
                to: 900,
                type: "square",
                dur: 0.016,
                gain: 0.028,
                delay: delay + t,
            }),
        );
        tone(c, d, {
            freq: 430,
            to: 300,
            type: "triangle",
            dur: 0.07,
            gain: 0.08,
            delay: delay + 0.44,
        });
    },

    mountOk: (c, d, { delay = 0 } = {}) => {
        tone(c, d, { freq: 1568, type: "sine", dur: 0.08, gain: 0.05, delay });
        tone(c, d, {
            freq: 2093,
            type: "sine",
            dur: 0.12,
            gain: 0.04,
            delay: delay + 0.06,
        });
    },

    rackOn: (c, d, { index = 0, delay = 0 } = {}) => {
        tone(c, d, {
            freq: 392 * (TRIAD[index] ?? 1.5),
            type: "square",
            dur: 0.09,
            gain: 0.04,
            delay,
        });
        noise(c, d, { dur: 0.012, gain: 0.03, hp: 2500, delay });
    },

    sting1: (c, d, { delay = 0 } = {}) => {
        thump(c, d, { freq: 150, to: 46, dur: 0.24, gain: 0.28, delay });
        noise(c, d, { dur: 0.09, gain: 0.1, hp: 250, lp: 5000, delay });
    },

    sting2: (c, d, { delay = 0 } = {}) => {
        relayClack(c, d, { delay });
        tone(c, d, {
            freq: 196,
            type: "sawtooth",
            dur: 0.5,
            gain: 0.035,
            delay,
        });
        relayClack(c, d, { delay: delay + 0.55 });
        tone(c, d, {
            freq: 880,
            type: "square",
            dur: 0.07,
            gain: 0.035,
            delay: delay + 0.55,
        });
    },

    sting3: (c, d, { delay = 0 } = {}) => {
        [392, 587, 784, 1175].forEach((freq, i) =>
            tone(c, d, {
                freq,
                type: "triangle",
                dur: 1.4,
                gain: 0.035,
                attack: 0.28,
                delay: delay + i * 0.12,
            }),
        );
        sweepNoise(c, d, {
            from: 2000,
            to: 6500,
            dur: 1.2,
            gain: 0.015,
            q: 2,
            delay,
        });
    },

    sting4: (c, d, { delay = 0 } = {}) => {
        noise(c, d, { dur: 0.35, gain: 0.08, hp: 1500, delay });
        sweepNoise(c, d, { from: 800, to: 3500, dur: 0.3, gain: 0.05, delay });
        tone(c, d, {
            freq: 1000,
            type: "square",
            dur: 0.07,
            gain: 0.04,
            delay: delay + 0.4,
        });
        tone(c, d, {
            freq: 1000,
            type: "square",
            dur: 0.07,
            gain: 0.04,
            delay: delay + 0.55,
        });
    },
};
