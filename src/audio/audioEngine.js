import { SYNTH } from "./sounds";
import { AUDIO_FILES, SAMPLES, SAMPLE_GAIN, MUSIC } from "./manifest";
import { createAmbience } from "./ambience";

const MASTER_GAIN = 0.5;
let ctx = null;
let master = null;
let muted = false;
let ambience = null;
const buffers = new Map();
const lastPick = new Map();
let preloading = null;

export const STAGE_AMBIENCE = { screen: 0.22, lamp: 0, room: 0.55 };

let wanted = { ...STAGE_AMBIENCE };
let wantedLamp = null;
let wantedDuck = 1;
let wantedDecay = 0;

const allUrls = () => [
    ...new Set([
        ...Object.values(AUDIO_FILES),
        ...Object.values(MUSIC),
        ...Object.values(SAMPLES).flatMap((e) => e.files),
    ]),
];

export function preloadAudio() {
    if (preloading) return preloading;

    const AC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    if (!AC) return Promise.resolve();

    const decoder = new AC(1, 1, 44100);
    preloading = Promise.all(
        allUrls().map(async (url) => {
            if (buffers.has(url)) return;

            try {
                const res = await fetch(url);
                if (!res.ok) return;

                buffers.set(
                    url,
                    await decoder.decodeAudioData(await res.arrayBuffer()),
                );
            } catch {}
        }),
    );

    return preloading;
}

export function initAudio() {
    if (ctx) {
        if (ctx.state === "suspended") ctx.resume();

        return;
    }

    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;

    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : MASTER_GAIN;
    master.connect(ctx.destination);

    ambience = createAmbience(ctx, master, playOn);
    ambience.set(wanted, 0.01);
    ambience.duck(wantedDuck, 0.01);
    ambience.setDecay(wantedDecay);

    if (wantedLamp) ambience.attachLamp(wantedLamp);

    preloadAudio();
}

export function setMuted(value) {
    muted = value;

    if (master)
        master.gain.setTargetAtTime(
            value ? 0 : MASTER_GAIN,
            ctx.currentTime,
            0.02,
        );
}

function pickSample(name, opts) {
    const kind = opts?.kind ?? opts?.side;
    const key = kind ? `${name}:${kind}` : name;
    const entry = SAMPLES[key] ?? SAMPLES[name];

    if (!entry) return null;

    const n = entry.files.length;
    let i = 0;

    if (entry.by === "index") {
        i = Math.max(0, Math.min(n - 1, opts?.index ?? 0));
    } else if (n > 1) {
        do i = Math.floor(Math.random() * n);
        while (i === lastPick.get(key));
        lastPick.set(key, i);
    }

    const buffer = buffers.get(entry.files[i]);
    if (!buffer) return null;

    const detune = entry.detune ?? 0;

    return {
        buffer,
        rate: 1 + (Math.random() * 2 - 1) * detune,
        gain:
            SAMPLE_GAIN *
            (entry.amt ? Math.max(0.25, Math.min(1, opts?.amt ?? 1)) : 1),
    };
}

function playOn(dest, name, opts) {
    const custom = AUDIO_FILES[name] && buffers.get(AUDIO_FILES[name]);
    const sample = custom
        ? { buffer: custom, rate: 1, gain: 1 }
        : pickSample(name, opts);

    if (sample) {
        const src = ctx.createBufferSource();
        const g = ctx.createGain();

        src.buffer = sample.buffer;
        src.playbackRate.value = sample.rate;
        g.gain.value = sample.gain;
        src.connect(g).connect(dest);
        src.start(ctx.currentTime + (opts?.delay ?? 0));

        return;
    }

    SYNTH[name]?.(ctx, dest, opts);
}

export function play(name, opts) {
    if (!ctx || muted) return;

    if (ctx.state === "suspended") ctx.resume();

    playOn(master, name, opts);
}

export function createMusic(name, { gain = 0.4 } = {}) {
    let src = null;
    let out = null;
    let startedAt = 0;
    let offset = 0;

    return {
        get playing() {
            return src !== null;
        },

        play(fade = 0.04) {
            const buffer = buffers.get(MUSIC[name]);
            if (!ctx || muted || !buffer || src) return;

            if (ctx.state === "suspended") ctx.resume();

            const t = ctx.currentTime;
            src = ctx.createBufferSource();
            src.buffer = buffer;
            src.loop = true;
            out = ctx.createGain();
            out.gain.setValueAtTime(0.0001, t);
            out.gain.linearRampToValueAtTime(gain, t + fade);
            src.connect(out).connect(master);
            const from = offset % buffer.duration;
            src.start(0, from);
            startedAt = t - from;
        },

        pause(fade = 0.015) {
            if (!src) return;

            const t = ctx.currentTime;
            offset = t - startedAt;
            out.gain.cancelScheduledValues(t);
            out.gain.setValueAtTime(Math.max(out.gain.value, 0.0001), t);
            out.gain.linearRampToValueAtTime(0.0001, t + fade);

            src.stop(t + fade + 0.01);
            src = null;
            out = null;
        },

        rewind() {
            offset = 0;
        },
    };
}

export function setAmbience(profile, tc = 0.8) {
    wanted = profile;
    ambience?.set(profile, tc);
}

export function duckAmbience(level, tc = 0.15) {
    wantedDuck = level;
    ambience?.duck(level, tc);
}

export function attachLamp(animation) {
    wantedLamp = animation;
    ambience?.attachLamp(animation);
}

export function detachLamp() {
    wantedLamp = null;
    ambience?.detachLamp();
}

export function setAudioDecay(level) {
    wantedDecay = level;
    ambience?.setDecay(level);
}
