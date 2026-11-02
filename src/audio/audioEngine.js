import { SYNTH } from "./sounds";
import { AUDIO_FILES } from "./manifest";
import { createAmbience } from "./ambience";

const MASTER_GAIN = 0.5;
let ctx = null;
let master = null;
let muted = false;
let ambience = null;
const buffers = new Map();

export const STAGE_AMBIENCE = { screen: 0.22, lamp: 0, room: 0.55 };

let wanted = { ...STAGE_AMBIENCE };
let wantedLamp = null;
let wantedDuck = 1;

async function loadFiles() {
    await Promise.all(
        Object.entries(AUDIO_FILES).map(async ([name, url]) => {
            try {
                const res = await fetch(url);
                if (!res.ok) return;

                buffers.set(
                    name,
                    await ctx.decodeAudioData(await res.arrayBuffer()),
                );
            } catch {}
        }),
    );
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

    ambience = createAmbience(ctx, master);
    ambience.set(wanted, 0.01);
    ambience.duck(wantedDuck, 0.01);

    if (wantedLamp) ambience.attachLamp(wantedLamp);
    loadFiles();
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

export function play(name, opts) {
    if (!ctx || muted) return;

    if (ctx.state === "suspended") ctx.resume();

    const buffer = buffers.get(name);
    if (buffer) {
        const src = ctx.createBufferSource();
        src.buffer = buffer;
        src.connect(master);
        src.start(ctx.currentTime + (opts?.delay ?? 0));
        return;
    }

    SYNTH[name]?.(ctx, master, opts);
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
