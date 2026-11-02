import { tone, noise, sweepNoise, thump, relayClack } from "./synthKit";

export const ROOM_SFX = {
    lampPop: (c, d, { kind = "strike", amt = 0.6, delay = 0 } = {}) => {
        if (kind === "drop") {
            noise(c, d, { dur: 0.014, gain: 0.05 * amt, hp: 2200, delay });
            tone(c, d, {
                freq: 900,
                to: 420,
                type: "sine",
                dur: 0.04,
                gain: 0.025 * amt,
                delay,
            });
        } else {
            noise(c, d, { dur: 0.03, gain: 0.07 * amt, hp: 1400, delay });
            tone(c, d, {
                freq: 2600,
                to: 1700,
                type: "sine",
                dur: 0.07,
                gain: 0.03 * amt,
                delay,
            });
            tone(c, d, {
                freq: 100,
                type: "sawtooth",
                dur: 0.09,
                gain: 0.03 * amt,
                delay,
            });
        }
    },

    flickerBuzz: (
        c,
        d,
        {
            keys = [
                [0, 0],
                [1, 1],
            ],
            ms = 600,
            tail = 1.1,
            gain = 0.03,
            delay = 0,
        } = {},
    ) => {
        const t = c.currentTime + delay;
        const bp = c.createBiquadFilter();

        bp.type = "bandpass";
        bp.frequency.value = 900;
        bp.Q.value = 0.8;

        const g = c.createGain();
        g.gain.setValueAtTime(0.0001, t);

        keys.forEach(([o, v]) =>
            g.gain.linearRampToValueAtTime(
                Math.max(0.0001, v * gain),
                t + (o * ms) / 1000,
            ),
        );

        const end = t + ms / 1000 + tail;
        g.gain.setValueAtTime(
            Math.max(0.0001, keys[keys.length - 1][1] * gain),
            t + ms / 1000,
        );
        g.gain.exponentialRampToValueAtTime(0.0001, end);

        bp.connect(g).connect(d);
        [
            [100, 1],
            [200.3, 0.4],
        ].forEach(([f, v]) => {
            const osc = c.createOscillator();
            const og = c.createGain();
            osc.type = "sawtooth";
            osc.frequency.value = f;
            og.gain.value = v;
            osc.connect(og).connect(bp);
            osc.start(t);
            osc.stop(end + 0.05);
        });
    },

    crackle: (c, d, { delay = 0 } = {}) => {
        noise(c, d, { dur: 0.012, gain: 0.022, hp: 3500, delay });

        if (Math.random() < 0.5)
            noise(c, d, {
                dur: 0.01,
                gain: 0.015,
                hp: 4200,
                delay: delay + 0.03 + Math.random() * 0.05,
            });
    },

    relay: (c, d, { delay = 0 } = {}) => relayClack(c, d, { delay }),

    degauss: (c, d, { delay = 0 } = {}) => {
        thump(c, d, { freq: 72, to: 30, dur: 0.8, gain: 0.2, delay });
        tone(c, d, {
            freq: 120,
            to: 48,
            type: "triangle",
            dur: 0.55,
            gain: 0.07,
            delay,
        });
        noise(c, d, { dur: 0.05, gain: 0.07, hp: 300, delay });
        sweepNoise(c, d, {
            from: 220,
            to: 90,
            dur: 0.5,
            gain: 0.04,
            q: 2,
            delay: delay + 0.05,
        });
    },

    powerOn: (c, d, { delay = 0 } = {}) => {
        ROOM_SFX.degauss(c, d, { delay });
        sweepNoise(c, d, {
            from: 1500,
            to: 9000,
            dur: 0.24,
            gain: 0.05,
            delay: delay + 0.42,
        });
        tone(c, d, {
            freq: 1500,
            to: 14000,
            type: "sine",
            dur: 0.6,
            gain: 0.02,
            attack: 0.3,
            delay: delay + 0.5,
        });
        noise(c, d, { dur: 0.03, gain: 0.05, hp: 1800, delay: delay + 1.08 });
    },

    powerUp: (c, d, { delay = 0 } = {}) => {
        thump(c, d, { freq: 90, to: 38, dur: 0.4, gain: 0.16, delay });
        sweepNoise(c, d, { from: 1200, to: 8000, dur: 0.3, gain: 0.05, delay });
        tone(c, d, {
            freq: 1800,
            to: 13000,
            type: "sine",
            dur: 0.45,
            gain: 0.018,
            attack: 0.2,
            delay: delay + 0.1,
        });
    },

    powerDown: (c, d, { delay = 0 } = {}) => {
        tone(c, d, {
            freq: 9000,
            to: 240,
            type: "sine",
            dur: 0.4,
            gain: 0.03,
            attack: 0.02,
            delay,
        });
        thump(c, d, { freq: 130, to: 38, dur: 0.34, gain: 0.2, delay });
        sweepNoise(c, d, { from: 5000, to: 300, dur: 0.3, gain: 0.06, delay });
        noise(c, d, { dur: 0.02, gain: 0.05, hp: 2000, delay: delay + 0.36 });
    },

    scanOut: (c, d, { delay = 0 } = {}) => {
        sweepNoise(c, d, { from: 5000, to: 700, dur: 0.34, gain: 0.05, delay });
        tone(c, d, {
            freq: 1800,
            to: 300,
            type: "sine",
            dur: 0.3,
            gain: 0.02,
            delay,
        });
    },

    scanIn: (c, d, { delay = 0 } = {}) => {
        sweepNoise(c, d, { from: 600, to: 6000, dur: 0.42, gain: 0.05, delay });
        tone(c, d, {
            freq: 300,
            to: 1800,
            type: "sine",
            dur: 0.38,
            gain: 0.02,
            delay,
        });
    },
};
