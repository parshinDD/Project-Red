export const SAMPLE_GAIN = 0.35;

const f = (name, n) =>
    Array.from({ length: n }, (_, i) => `/audio/${name}${i + 1}.ogg`);
const idx = (name, n) =>
    Array.from({ length: n }, (_, i) => `/audio/${name}${i}.ogg`);
const one = (name) => [`/audio/${name}.ogg`];

export const SAMPLES = {
    tick: { files: f("tick", 4), detune: 0.05 },
    click: { files: f("click", 2), detune: 0.03 },
    blip: { files: one("blip"), detune: 0.03 },
    confirm: { files: one("confirm") },
    error: { files: f("error", 2) },
    hit: { files: f("hit", 2), detune: 0.03 },
    found: { files: one("found") },
    miss: { files: one("miss"), detune: 0.04 },
    shard: { files: one("shard") },
    mode: { files: one("mode") },
    boot: { files: one("boot") },
    glitch: { files: f("glitch", 2) },
    success: { files: one("success") },
    achieve: { files: one("achieve") },
    gem: { files: one("gem") },
    pad: { files: idx("pad", 4), by: "index" },
    "lampPop:drop": { files: f("lampPopDrop", 2), detune: 0.05, amt: true },
    "lampPop:strike": { files: f("lampPopStrike", 2), detune: 0.05, amt: true },
    crackle: { files: f("crackle", 3), detune: 0.08 },
    relay: { files: f("relay", 3), detune: 0.03 },
    degauss: { files: one("degauss") },
    powerOn: { files: one("powerOn") },
    powerUp: { files: one("powerUp") },
    powerDown: { files: one("powerDown") },
    scanOut: { files: one("scanOut") },
    scanIn: { files: one("scanIn") },
    doorsClose: { files: one("doorsClose") },
    doorsOpen: { files: one("doorsOpen") },
    ratchet: { files: one("ratchet") },
    mountOk: { files: one("mountOk") },
    rackOn: { files: idx("rackOn", 3), by: "index" },
    sting1: { files: one("sting1") },
    sting2: { files: one("sting2") },
    sting3: { files: one("sting3") },
    sting4: { files: one("sting4") },

    lightGreen: { files: one("lightGreen") },
    lightRed: { files: one("lightRed") },
    step: { files: f("step", 4), detune: 0.05 },
    "glassTap:L": { files: f("glassTapL", 2), detune: 0.02 },
    "glassTap:R": { files: f("glassTapR", 2), detune: 0.02 },
    glassStep: { files: idx("glassStep", 6), by: "index" },
    glassCrack: { files: one("glassCrack") },
    anomaly: { files: one("anomaly") },
    stamp: { files: f("stamp", 2), detune: 0.03 },
    unstamp: { files: one("unstamp") },
    paper: { files: f("paper", 3), detune: 0.05 },
    decayBurst: { files: f("decayBurst", 3), amt: true },
};

export const MUSIC = {
    redLight: "/audio/musRedLight.ogg",
};

export const AUDIO_FILES = {};
