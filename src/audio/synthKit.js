export function tone(
    ctx,
    dest,
    {
        freq = 440,
        to,
        type = "square",
        dur = 0.1,
        gain = 0.15,
        delay = 0,
        attack = 0.008,
    },
) {
    const t = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (to) osc.frequency.exponentialRampToValueAtTime(to, t + dur);

    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + Math.min(attack, dur * 0.5));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    osc.connect(g).connect(dest);
    osc.start(t);
    osc.stop(t + dur + 0.03);
}

export function noiseBuffer(ctx, seconds = 2) {
    const len = Math.max(1, Math.floor(ctx.sampleRate * seconds));
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);

    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;

    return buf;
}

export function noise(
    ctx,
    dest,
    { dur = 0.08, gain = 0.08, delay = 0, hp = 1200, lp },
) {
    const t = ctx.currentTime + delay;
    const len = Math.max(1, Math.floor(ctx.sampleRate * dur));
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);

    for (let i = 0; i < len; i++)
        data[i] = (Math.random() * 2 - 1) * (1 - i / len);

    const src = ctx.createBufferSource();
    const high = ctx.createBiquadFilter();
    const g = ctx.createGain();

    high.type = "highpass";
    high.frequency.value = hp;
    g.gain.value = gain;
    src.buffer = buf;
    src.connect(high);

    if (lp) {
        const low = ctx.createBiquadFilter();
        low.type = "lowpass";
        low.frequency.value = lp;
        high.connect(low).connect(g);
    } else {
        high.connect(g);
    }

    g.connect(dest);
    src.start(t);
}

export function sweepNoise(
    ctx,
    dest,
    {
        from = 500,
        to = 3000,
        dur = 0.3,
        gain = 0.06,
        q = 1.1,
        delay = 0,
        type = "bandpass",
        attack = 0.02,
    },
) {
    const t = ctx.currentTime + delay;
    const len = Math.max(1, Math.floor(ctx.sampleRate * (dur + 0.05)));
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);

    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;

    const src = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const g = ctx.createGain();

    filter.type = type;
    filter.Q.value = q;
    filter.frequency.setValueAtTime(from, t);
    filter.frequency.exponentialRampToValueAtTime(to, t + dur);

    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + Math.min(attack, dur * 0.5));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    src.buffer = buf;
    src.connect(filter).connect(g).connect(dest);
    src.start(t);
    src.stop(t + dur + 0.05);
}

export function thump(
    ctx,
    dest,
    { freq = 100, to = 40, dur = 0.22, gain = 0.2, delay = 0 },
) {
    tone(ctx, dest, {
        freq,
        to,
        type: "sine",
        dur,
        gain,
        delay,
        attack: 0.004,
    });
}

export function relayClack(ctx, dest, { delay = 0, gain = 0.06 } = {}) {
    noise(ctx, dest, { dur: 0.022, gain, hp: 1500, delay });
    tone(ctx, dest, {
        freq: 190,
        to: 120,
        type: "square",
        dur: 0.03,
        gain: gain * 0.8,
        delay,
    });
}
