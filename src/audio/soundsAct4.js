import { noiseBuffer } from "./synthKit";
import { morseSchedule, UNIT } from "@/game/data/morse";

export const morseDuration = (text, unit = UNIT) =>
    morseSchedule(text, unit).total;

export function createDrone({ ctx, master }) {
    const out = ctx.createGain();
    const lp = ctx.createBiquadFilter();
    const hum = ctx.createGain();
    const whineGain = ctx.createGain();
    const roarGain = ctx.createGain();
    const roarBand = ctx.createBiquadFilter();
    const lfo = ctx.createOscillator();
    const lfoDepth = ctx.createGain();
    const nodes = [];

    out.gain.value = 0.0001;
    out.connect(master);

    lp.type = "lowpass";
    lp.frequency.value = 120;
    lp.connect(hum).connect(out);
    hum.gain.value = 1;

    [
        [55, "sawtooth", 0.1],
        [55.8, "sawtooth", 0.1],
        [110.4, "square", 0.05],
        [27.5, "sine", 0.18],
    ].forEach(([f, type, g]) => {
        const o = ctx.createOscillator();
        const og = ctx.createGain();

        o.type = type;
        o.frequency.value = f;
        og.gain.value = g;
        o.connect(og).connect(lp);
        o.start();
        nodes.push(o);
    });

    const whine = ctx.createOscillator();

    whine.type = "sine";
    whine.frequency.value = 180;

    whineGain.gain.value = 0;
    whine.connect(whineGain).connect(out);
    whine.start();
    nodes.push(whine);

    const roar = ctx.createBufferSource();

    roar.buffer = noiseBuffer(ctx, 2);
    roar.loop = true;

    roarBand.type = "bandpass";
    roarBand.frequency.value = 400;
    roarBand.Q.value = 0.5;
    roarGain.gain.value = 0;

    roar.connect(roarBand).connect(roarGain).connect(out);
    roar.start();
    nodes.push(roar);

    lfo.frequency.value = 6;
    lfoDepth.gain.value = 0;

    lfo.connect(lfoDepth).connect(out.gain);
    lfo.start();
    nodes.push(lfo);

    let dead = false;

    return {
        level(k) {
            if (dead) return;

            const now = ctx.currentTime;
            const kk = k * k;

            out.gain.setTargetAtTime(0.02 + 0.3 * kk, now, 0.2);
            lp.frequency.setTargetAtTime(110 + 2000 * kk, now, 0.25);
            whine.frequency.setTargetAtTime(180 * Math.pow(16, k), now, 0.25);
            whineGain.gain.setTargetAtTime(0.01 + 0.16 * kk, now, 0.25);
            roarBand.frequency.setTargetAtTime(300 + 1800 * k, now, 0.25);
            roarGain.gain.setTargetAtTime(0.02 + 0.28 * kk, now, 0.25);
            lfo.frequency.setTargetAtTime(4 + 16 * k, now, 0.3);
            lfoDepth.gain.setTargetAtTime(0.02 * kk, now, 0.3);
        },
        cut() {
            if (dead) return;

            dead = true;

            const now = ctx.currentTime;

            out.gain.cancelScheduledValues(now);
            out.gain.setValueAtTime(0, now);

            lfoDepth.gain.setValueAtTime(0, now);
            nodes.forEach((n) => {
                try {
                    n.stop(now + 0.02);
                } catch {}
            });

            setTimeout(() => out.disconnect(), 100);
        },
    };
}

export const ACT4_SFX = {
    thud: (c, d) => {
        const t = c.currentTime;
        const o = c.createOscillator();
        const g = c.createGain();

        o.type = "sine";
        o.frequency.setValueAtTime(90, t);
        o.frequency.exponentialRampToValueAtTime(32, t + 0.5);

        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(0.5, t + 0.012);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);

        o.connect(g).connect(d);
        o.start(t);
        o.stop(t + 0.75);
    },

    keyTap: (c, d) => {
        const t = c.currentTime;
        const buf = c.createBuffer(1, c.sampleRate * 0.04, c.sampleRate);
        const data = buf.getChannelData(0);

        for (let i = 0; i < data.length; i++)
            data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);

        const src = c.createBufferSource();
        const hp = c.createBiquadFilter();
        const g = c.createGain();

        src.buffer = buf;
        hp.type = "highpass";
        hp.frequency.value = 2400;
        g.gain.setValueAtTime(0.16, t);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.035);
        src.connect(hp).connect(g).connect(d);
        src.start(t);

        const o = c.createOscillator();
        const og = c.createGain();

        o.type = "sine";
        o.frequency.setValueAtTime(150, t);
        o.frequency.exponentialRampToValueAtTime(64, t + 0.08);

        og.gain.setValueAtTime(0.12, t);
        og.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);

        o.connect(og).connect(d);
        o.start(t);
        o.stop(t + 0.12);
    },

    bootChime: (c, d) => {
        const t = c.currentTime;

        [
            [523.25, 0],
            [783.99, 0.22],
        ].forEach(([f, at]) => {
            const o = c.createOscillator();
            const g = c.createGain();

            o.type = "sine";
            o.frequency.value = f;

            g.gain.setValueAtTime(0.0001, t + at);
            g.gain.linearRampToValueAtTime(0.1, t + at + 0.03);
            g.gain.exponentialRampToValueAtTime(0.0001, t + at + 1.4);

            o.connect(g).connect(d);
            o.start(t + at);
            o.stop(t + at + 1.5);
        });
    },

    morse: (c, d, { text = "RED", unit = UNIT, delay = 0 } = {}) => {
        const { beeps, total } = morseSchedule(text, unit);

        const t0 = c.currentTime + delay + 0.25;
        const edge = 0.006;

        beeps.forEach(({ at, dur }) => {
            const osc = c.createOscillator();
            const g = c.createGain();
            const s = t0 + at;

            osc.type = "sine";
            osc.frequency.value = 640;

            g.gain.setValueAtTime(0.0001, s);
            g.gain.linearRampToValueAtTime(0.11, s + edge);
            g.gain.setValueAtTime(0.11, s + dur - edge);
            g.gain.linearRampToValueAtTime(0.0001, s + dur);

            osc.connect(g).connect(d);
            osc.start(s);
            osc.stop(s + dur + 0.02);
        });

        const hiss = c.createBufferSource();
        const band = c.createBiquadFilter();
        const g = c.createGain();

        hiss.buffer = noiseBuffer(c, total + 0.8);

        band.type = "bandpass";
        band.frequency.value = 1800;
        band.Q.value = 0.6;

        g.gain.setValueAtTime(0.0001, t0 - 0.2);
        g.gain.linearRampToValueAtTime(0.018, t0 - 0.05);
        g.gain.setValueAtTime(0.018, t0 + total);
        g.gain.linearRampToValueAtTime(0.0001, t0 + total + 0.25);

        hiss.connect(band).connect(g).connect(d);
        hiss.start(t0 - 0.2);
        hiss.stop(t0 + total + 0.35);
    },
};
