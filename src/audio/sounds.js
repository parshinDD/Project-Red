import { tone, noise } from "./synthKit";
import { ROOM_SFX } from "./soundsRoom";
import { TRANSITION_SFX } from "./soundsTransition";
import { ACT2_SFX } from "./soundsAct2";
import { DECAY_SFX } from "./soundsDecay";

const PAD_FREQ = [262, 330, 392, 523];

const UI_SFX = {
    tick: (c, d) => tone(c, d, { freq: 1900, dur: 0.02, gain: 0.025 }),
    click: (c, d) => tone(c, d, { freq: 720, to: 540, dur: 0.05, gain: 0.07 }),
    blip: (c, d) =>
        tone(c, d, { freq: 880, dur: 0.07, gain: 0.08, type: "triangle" }),
    confirm: (c, d) => {
        tone(c, d, { freq: 520, dur: 0.08, gain: 0.1, type: "triangle" });
        tone(c, d, {
            freq: 780,
            dur: 0.12,
            gain: 0.1,
            type: "triangle",
            delay: 0.08,
        });
    },
    error: (c, d) => {
        tone(c, d, {
            freq: 190,
            to: 120,
            dur: 0.22,
            gain: 0.14,
            type: "sawtooth",
        });
        noise(c, d, { dur: 0.1, gain: 0.05, hp: 400 });
    },
    hit: (c, d) => {
        tone(c, d, {
            freq: 140,
            to: 60,
            dur: 0.18,
            gain: 0.2,
            type: "sawtooth",
        });
        noise(c, d, { dur: 0.12, gain: 0.08, hp: 600 });
    },
    found: (c, d) => {
        tone(c, d, { freq: 660, dur: 0.08, gain: 0.1, type: "triangle" });
        tone(c, d, {
            freq: 990,
            dur: 0.14,
            gain: 0.1,
            type: "triangle",
            delay: 0.07,
        });
    },
    miss: (c, d) =>
        tone(c, d, {
            freq: 300,
            to: 240,
            dur: 0.07,
            gain: 0.05,
            type: "triangle",
        }),
    shard: (c, d) => {
        [660, 880, 1320, 1760].forEach((freq, i) =>
            tone(c, d, {
                freq,
                dur: 0.22,
                gain: 0.09,
                type: "triangle",
                delay: i * 0.07,
            }),
        );
    },
    mode: (c, d) => {
        tone(c, d, {
            freq: 330,
            to: 660,
            dur: 0.12,
            gain: 0.08,
            type: "square",
        });
    },
    boot: (c, d) =>
        tone(c, d, {
            freq: 120,
            to: 480,
            dur: 0.5,
            gain: 0.08,
            type: "sawtooth",
        }),
    glitch: (c, d) => {
        noise(c, d, { dur: 0.18, gain: 0.09, hp: 800 });
        tone(c, d, {
            freq: 90,
            to: 400,
            dur: 0.12,
            gain: 0.07,
            type: "square",
        });
    },
    success: (c, d) => {
        [392, 523, 659, 784].forEach((freq, i) =>
            tone(c, d, {
                freq,
                dur: 0.18,
                gain: 0.1,
                type: "triangle",
                delay: i * 0.09,
            }),
        );
    },
    achieve: (c, d) => {
        [784, 988, 1175, 1568].forEach((freq, i) =>
            tone(c, d, {
                freq,
                dur: 0.32,
                gain: 0.07,
                type: "triangle",
                delay: i * 0.09,
            }),
        );
        tone(c, d, {
            freq: 2349,
            dur: 0.5,
            gain: 0.04,
            type: "sine",
            delay: 0.4,
        });
    },
    gem: (c, d) => {
        tone(c, d, { freq: 2093, dur: 0.14, gain: 0.08, type: "triangle" });
        tone(c, d, {
            freq: 3136,
            dur: 0.22,
            gain: 0.05,
            type: "sine",
            delay: 0.05,
        });
    },
    pad: (c, d, { index = 0 } = {}) =>
        tone(c, d, {
            freq: PAD_FREQ[index] ?? 262,
            dur: 0.3,
            gain: 0.2,
            type: "triangle",
        }),
};

export const SYNTH = {
    ...UI_SFX,
    ...ROOM_SFX,
    ...TRANSITION_SFX,
    ...ACT2_SFX,
    ...DECAY_SFX,
};
