import numpy as np
from scipy import signal

SR = 44100
rng = np.random.default_rng(2012)


def reseed(seed):
    global rng
    rng = np.random.default_rng(seed)


def n_(sec):
    return int(round(sec * SR))


def tt(sec):
    return np.arange(n_(sec)) / SR


def white(sec):
    return rng.standard_normal(n_(sec))


def _sos(kind, f, order):
    return signal.butter(order, f, btype=kind, fs=SR, output='sos')


def lp(x, f, order=2):
    return signal.sosfilt(_sos('lowpass', min(f, SR * 0.45), order), x)


def hp(x, f, order=2):
    return signal.sosfilt(_sos('highpass', f, order), x)


def bp(x, lo, hi, order=2):
    return signal.sosfilt(_sos('bandpass', [lo, min(hi, SR * 0.45)], order), x)


def env(sec, tau, attack=0.0004):
    t = tt(sec)
    return np.exp(-t / tau) * np.minimum(1.0, t / max(attack, 1e-5))


def shape(sec, attack, hold, release):
    n = n_(sec)
    e = np.zeros(n)
    a, h, r = n_(attack), n_(hold), n_(release)
    e[:a] = np.linspace(0, 1, a, endpoint=False)
    e[a:a + h] = 1
    e[a + h:a + h + r] = np.linspace(1, 0, r)[: max(0, n - a - h)]

    return e


def sweep_sine(f0, f1, sec, harmonics=(1.0,)):
    t = tt(sec)
    f = f0 * (f1 / f0) ** (t / sec)
    phase = 2 * np.pi * np.cumsum(f) / SR

    return sum(a * np.sin((k + 1) * phase) for k, a in enumerate(harmonics))


def sweep_noise(f0, f1, sec, q=1.2, seed=None):
    x = white(sec)
    out = np.zeros_like(x)
    block = 256
    zi = None
    nb = (len(x) + block - 1) // block

    for i in range(nb):
        fc = f0 * (f1 / f0) ** (i / max(1, nb - 1))
        bw = max(60.0, fc / q)
        lo, hi = max(20.0, fc - bw / 2), min(SR * 0.45, fc + bw / 2)
        s = _sos('bandpass', [lo, hi], 2)
        seg = x[i * block:(i + 1) * block]
        if zi is None or zi.shape != (s.shape[0], 2):
            zi = np.zeros((s.shape[0], 2))
        y, zi = signal.sosfilt(s, seg, zi=zi)
        out[i * block:(i + 1) * block] = y

    return out


def modal(freqs, decays, amps, sec, jitter=0.0, attack=0.0003):
    t = tt(sec)
    out = np.zeros_like(t)

    for f, d, a in zip(freqs, decays, amps):
        f2 = f * (1 + rng.normal(0, jitter)) if jitter else f
        out += a * np.exp(-t / d) * np.sin(2 * np.pi * f2 * t + rng.uniform(0, 2 * np.pi))

    return out * np.minimum(1.0, t / attack)


def bell(freq, sec, tau=0.5, bright=1.0):
    r = [1.0, 2.0, 2.76, 5.4, 8.93]
    d = [tau, tau * 0.6, tau * 0.45, tau * 0.25, tau * 0.15]
    a = [1.0, 0.45 * bright, 0.35 * bright, 0.15 * bright, 0.08 * bright]

    return modal([freq * k for k in r], d, a, sec)


def glass(freq, sec, tau=0.22):
    r = [1.0, 2.32, 4.25, 6.63, 9.38]
    d = [tau, tau * 0.6, tau * 0.35, tau * 0.2, tau * 0.14]
    a = [1.0, 0.6, 0.35, 0.2, 0.12]

    return modal([freq * k for k in r], d, a, sec, jitter=0.002)


def musicbox(freq, sec, tau=1.2):
    return modal([freq, freq * 6.27, freq * 17.55], [tau, tau * 0.2, tau * 0.07], [1.0, 0.16, 0.04], sec)


def click(sec=0.01, lo=1500, hi=6000, tau=0.002):
    return bp(white(sec), lo, hi) * env(sec, tau, 0.00008)


def thump(f0=120, f1=50, sec=0.2, tau=0.06):
    return sweep_sine(f0, f1, sec) * env(sec, tau, 0.002)


def saturate(x, drive=2.0):
    return np.tanh(x * drive) / np.tanh(drive)


def make_ir(rt60, predelay=0.01, damp=5000, early=True):
    n = n_(rt60 * 1.15)
    t = np.arange(n) / SR
    ir = rng.standard_normal(n) * np.exp(-6.91 * t / rt60)
    ir = lp(ir, damp, 1)
    ir[: n_(predelay)] = 0

    if early:
        for _ in range(7):
            k = n_(predelay + rng.uniform(0.003, 0.05))

            if k < n:
                ir[k] += rng.uniform(-1, 1) * 0.9

    return ir / np.sqrt(np.sum(ir ** 2))


def reverb(x, rt60=0.5, wet=0.2, damp=5000, predelay=0.01, tail=True):
    ir = make_ir(rt60, predelay, damp)
    y = signal.fftconvolve(x, ir)
    dry = np.zeros_like(y)
    dry[: len(x)] = x
    out = dry * (1 - wet * 0.5) + y * wet * 1.4

    return out if tail else out[: len(x)]


class Track:
    def __init__(self, sec):
        self.x = np.zeros(n_(sec))

    def add(self, y, at=0.0, gain=1.0):
        i = n_(at)
        if i >= len(self.x):
            return self

        j = min(len(self.x), i + len(y))
        self.x[i:j] += y[: j - i] * gain

        return self

    def get(self):
        return self.x


def finish(x, peak, fade_ms=6, dc=True):
    x = np.asarray(x, dtype=np.float64)
    if dc:
        x = hp(x, 18, 1)

    f = min(len(x), n_(fade_ms / 1000))
    x[-f:] *= np.linspace(1, 0, f)
    x[:6] *= np.linspace(0, 1, 6)
    m = np.max(np.abs(x)) or 1.0

    return x / m * peak
