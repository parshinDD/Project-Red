import { noiseBuffer } from "./synthKit";
import { SYNTH } from "./sounds";

const BASE = { hum: 0.05, whine: 0.0022, hiss: 0.0055, room: 0.03, lamp: 0.03 };
const LAMP_REST = 0.55;
const LOOKAHEAD_MS = 1500;
const TICK_MS = 500;
const POP_MIN_STEP = 0.3;
const POP_MAX_MS = 300;

const num = (t) =>
    typeof t === "number"
        ? t
        : t && typeof t.to === "function"
          ? t.to("ms").value
          : null;

export function createAmbience(ctx, dest) {
    const now = () => ctx.currentTime;

    const out = ctx.createGain();

    out.gain.value = 0;
    out.connect(dest);
    out.gain.setTargetAtTime(1, now(), 0.9);
    const bus = ctx.createGain();
    bus.connect(out);

    const gainNode = (v, to = bus) => {
        const g = ctx.createGain();
        g.gain.value = v;
        g.connect(to);
        return g;
    };

    const filter = (type, freq, q = 0.7) => {
        const f = ctx.createBiquadFilter();
        f.type = type;
        f.frequency.value = freq;
        f.Q.value = q;
        return f;
    };

    const osc = (type, freq, to) => {
        const o = ctx.createOscillator();
        o.type = type;
        o.frequency.value = freq;
        o.connect(to);
        o.start();
        return o;
    };

    const loop = (seconds, to) => {
        const s = ctx.createBufferSource();
        s.buffer = noiseBuffer(ctx, seconds);
        s.loop = true;
        s.connect(to);
        s.start();
        return s;
    };

    const wobble = gainNode(1);
    const humGain = gainNode(0, wobble);
    const humLow = filter("lowpass", 520);
    humLow.connect(humGain);

    [
        [50, "sine", 0.25],
        [100, "sine", 0.6],
        [150, "sine", 0.32],
        [200, "triangle", 0.2],
        [300, "sawtooth", 0.05],
    ].forEach(([f, type, v]) => osc(type, f, gainNode(v, humLow)));
    osc("sine", 0.11, gainNode(0.07, wobble.gain));

    const whineGain = gainNode(0);
    osc("sine", 15625, whineGain);

    const hissGain = gainNode(0);
    const hissHigh = filter("highpass", 3000);
    hissHigh.connect(filter("lowpass", 9000)).connect(hissGain);
    loop(3, hissHigh);

    const roomGain = gainNode(0);
    const roomLow = filter("lowpass", 180);
    roomLow.connect(roomGain);
    loop(4, roomLow);

    const lampLevel = gainNode(0);
    const lampGain = gainNode(LAMP_REST, lampLevel);
    const lampBand = filter("bandpass", 900, 0.8);
    lampBand.connect(lampGain);

    osc("sawtooth", 100, gainNode(1, lampBand));
    osc("sawtooth", 200.3, gainNode(0.4, lampBand));

    const state = { screen: 0, lamp: 0 };

    function set(profile, tc = 0.8) {
        const screen = profile.screen ?? 0;
        const lamp = profile.lamp ?? 0;
        const on = screen > 0.001;
        const t = now();

        humGain.gain.setTargetAtTime(
            on ? (0.3 + 0.7 * screen) * BASE.hum : 0,
            t,
            tc,
        );

        whineGain.gain.setTargetAtTime(
            on ? (0.2 + 0.8 * screen) * BASE.whine : 0,
            t,
            tc,
        );

        hissGain.gain.setTargetAtTime(
            (on ? 0.3 + 0.7 * screen : 0.05) * BASE.hiss,
            t,
            tc,
        );

        roomGain.gain.setTargetAtTime((profile.room ?? 1) * BASE.room, t, tc);
        lampLevel.gain.setTargetAtTime(lamp * BASE.lamp, t, tc);
        state.screen = screen;
        state.lamp = lamp;
    }

    function duck(level, tc = 0.15) {
        bus.gain.setTargetAtTime(level, now(), tc);
    }

    const lamp = { anim: null, keys: [], T: 0, until: null, steady: true };

    function attachLamp(anim) {
        lamp.anim = anim;
        lamp.until = null;
        lamp.keys = [];
        lamp.steady = true;

        try {
            const timing = anim.effect.getComputedTiming();
            const frames = anim.effect.getKeyframes();

            const keys = frames
                .map((k) => ({
                    o: k.computedOffset ?? k.offset,
                    v: parseFloat(k.opacity),
                }))
                .filter((k) => Number.isFinite(k.o) && Number.isFinite(k.v))
                .sort((a, b) => a.o - b.o);
            if (keys.length >= 2 && timing.duration >= 1000) {
                lamp.keys = keys;
                lamp.T = timing.duration;
                lamp.steady = false;
            }
        } catch {}
        if (lamp.steady) lampGain.gain.setTargetAtTime(LAMP_REST, now(), 0.3);
    }

    function detachLamp() {
        lamp.anim = null;
        lamp.until = null;
        lampGain.gain.setTargetAtTime(0, now(), 0.15);
    }

    function valueAt(t) {
        const p = (t % lamp.T) / lamp.T;
        const { keys } = lamp;

        for (let i = 1; i < keys.length; i++) {
            if (p <= keys[i].o) {
                const a = keys[i - 1];
                const b = keys[i];
                return b.o === a.o
                    ? b.v
                    : a.v + ((b.v - a.v) * (p - a.o)) / (b.o - a.o);
            }
        }

        return keys[keys.length - 1].v;
    }

    function lampTick() {
        if (!lamp.anim || lamp.steady) return;

        const tNow = num(lamp.anim.currentTime);
        if (tNow == null) return;

        const { keys, T } = lamp;

        if (
            lamp.until == null ||
            tNow - lamp.until > 2 * LOOKAHEAD_MS ||
            tNow < lamp.until - 5000
        ) {
            lampGain.gain.cancelScheduledValues(now());
            lampGain.gain.setValueAtTime(valueAt(tNow), now());
            lamp.until = tNow;
        }

        const horizon = tNow + LOOKAHEAD_MS;
        for (
            let loopIdx = Math.floor(lamp.until / T);
            loopIdx <= Math.floor(horizon / T);
            loopIdx++
        ) {
            for (let i = 0; i < keys.length; i++) {
                const abs = loopIdx * T + keys[i].o * T;
                if (abs <= lamp.until || abs > horizon) continue;

                const at = now() + (abs - tNow) / 1000;
                lampGain.gain.linearRampToValueAtTime(keys[i].v, at);

                if (i === 0 || state.lamp < 0.05) continue;

                const step = keys[i].v - keys[i - 1].v;
                const ms = (keys[i].o - keys[i - 1].o) * T;
                if (Math.abs(step) >= POP_MIN_STEP && ms <= POP_MAX_MS) {
                    SYNTH.lampPop(ctx, bus, {
                        kind: step > 0 ? "strike" : "drop",
                        amt:
                            Math.min(1, Math.abs(step)) *
                            (0.4 + 0.6 * state.lamp),
                        delay: at - now(),
                    });
                }
            }
        }

        lamp.until = horizon;
    }

    function tick() {
        lampTick();

        if (state.screen > 0.25 && Math.random() < 0.07)
            SYNTH.crackle(ctx, bus, { delay: Math.random() * 0.4 });
    }

    setInterval(tick, TICK_MS);

    return { set, duck, attachLamp, detachLamp };
}
