const ROOM_LP = 2600;
const ECHO_MS = 430;
const ECHO_FB = 0.3;

const LEVEL = 0.8;

const CHORDS = [
    [110.0, 164.81, 220.0, 261.63],
    [87.31, 130.81, 174.61, 220.0],
    [130.81, 196.0, 261.63, 329.63],
    [98.0, 146.83, 196.0, 246.94],
];

const STEP = 0.95;
const PATTERN = [
    [0, 1],
    [2, 0.55],
    [3, 0.7],
    [2, 0.5],
    [1, 0.6],
    [3, 0.45],
    [2, 0.5],
    [0, 0.4],
];
const CHORD_STEPS = PATTERN.length;
const LOOP = STEP * CHORD_STEPS * CHORDS.length;

const EVENTS = [];

CHORDS.forEach((chord, ci) => {
    PATTERN.forEach(([idx, vel], pi) => {
        EVENTS.push({
            t: (ci * CHORD_STEPS + pi) * STEP,
            f: chord[idx],
            v: vel,
        });
    });
});

const PAD_ROOT = CHORDS.map((c) => c[0]);
const PAD_FIFTH = CHORDS.map((c) => c[1]);

export function createFinaleMusic({ ctx, master }) {
    const out = ctx.createGain();
    const room = ctx.createBiquadFilter();
    const echo = ctx.createDelay(1);
    const echoFb = ctx.createGain();
    const echoDamp = ctx.createBiquadFilter();
    const echoSend = ctx.createGain();
    const padRoot = ctx.createOscillator();
    const padFifth = ctx.createOscillator();
    const padRootGain = ctx.createGain();
    const padFifthGain = ctx.createGain();
    const padLp = ctx.createBiquadFilter();

    out.gain.value = 0.0001;
    out.connect(master);

    room.type = "lowpass";
    room.frequency.value = ROOM_LP;
    room.connect(out);

    echo.delayTime.value = ECHO_MS / 1000;
    echoFb.gain.value = ECHO_FB;
    echoDamp.type = "lowpass";
    echoDamp.frequency.value = 1500;
    echoSend.gain.value = 0.4;

    echo.connect(echoDamp).connect(echoFb).connect(echo);
    echo.connect(out);
    echoSend.connect(echo);

    padRoot.type = "triangle";
    padFifth.type = "triangle";
    padRoot.frequency.value = PAD_ROOT[0] / 2;
    padFifth.frequency.value = PAD_FIFTH[0] / 2;

    padLp.type = "lowpass";
    padLp.frequency.value = 700;

    padRootGain.gain.value = 0.0001;
    padFifthGain.gain.value = 0.0001;

    padRoot.connect(padRootGain).connect(padLp);
    padFifth.connect(padFifthGain).connect(padLp);
    padLp.connect(out);

    let timer = 0;
    let idx = 0;
    let loops = 0;
    let startAt = 0;
    let running = false;
    let stopped = false;

    const note = (f, at, vel) => {
        const dur = Math.max(2.6, 4.6 - f / 240);
        const g = ctx.createGain();
        const level = vel * 0.07 * (0.92 + Math.random() * 0.16);

        g.gain.setValueAtTime(0.0001, at);
        g.gain.linearRampToValueAtTime(level, at + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, at + dur);

        g.connect(room);
        g.connect(echoSend);

        [
            [f, 1],
            [f * 2, 0.32],
            [f * 3, 0.07],
        ].forEach(([freq, amp]) => {
            const o = ctx.createOscillator();
            const og = ctx.createGain();

            o.type = "sine";
            o.frequency.value = freq * (1 + (Math.random() - 0.5) * 0.0012);
            og.gain.value = amp;

            o.connect(og).connect(g);
            o.start(at);
            o.stop(at + dur + 0.05);
        });
    };

    const schedule = () => {
        const now = ctx.currentTime;
        let guard = 0;

        while (guard++ < 64) {
            const ev = EVENTS[idx];
            const at = startAt + loops * LOOP + ev.t;

            if (at > now + 0.7) break;

            if (at >= now - 0.05) note(ev.f, at, ev.v);

            idx++;

            if (idx >= EVENTS.length) {
                idx = 0;
                loops++;
            }
        }
    };

    const start = () => {
        if (running || stopped) return;

        running = true;

        const t = ctx.currentTime;

        out.gain.cancelScheduledValues(t);
        out.gain.setValueAtTime(0.0001, t);
        out.gain.linearRampToValueAtTime(LEVEL, t + 4);

        padRootGain.gain.linearRampToValueAtTime(0.02, t + 5);
        padFifthGain.gain.linearRampToValueAtTime(0.014, t + 6);

        padRoot.start(t);
        padFifth.start(t);

        startAt = t + 0.3;
        schedule();
        timer = setInterval(schedule, 250);
    };

    const stop = () => {
        if (stopped) return;

        stopped = true;
        clearInterval(timer);

        const t = ctx.currentTime;

        out.gain.cancelScheduledValues(t);
        out.gain.setValueAtTime(Math.max(out.gain.value, 0.0001), t);
        out.gain.linearRampToValueAtTime(0.0001, t + 1.2);

        try {
            padRoot.stop(t + 1.3);
            padFifth.stop(t + 1.3);
        } catch {}

        setTimeout(() => out.disconnect(), 1500);
    };

    let chordIdx = -1;

    const padTimer = setInterval(() => {
        if (!running || stopped) return;

        const rel = ctx.currentTime - startAt;

        if (rel < 0) return;

        const next = Math.floor((rel % LOOP) / (STEP * CHORD_STEPS));

        if (next === chordIdx) return;

        chordIdx = next;

        const t = ctx.currentTime;

        padRoot.frequency.setTargetAtTime(PAD_ROOT[chordIdx] / 2, t, 1.6);
        padFifth.frequency.setTargetAtTime(PAD_FIFTH[chordIdx] / 2, t, 1.6);
    }, 500);

    return {
        get playing() {
            return running;
        },
        start,
        stop() {
            clearInterval(padTimer);
            stop();
        },
    };
}
