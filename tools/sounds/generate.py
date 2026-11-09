#!/usr/bin/env python3
import os
import subprocess
import sys
import tempfile

import numpy as np
from scipy.io import wavfile

import dsp
from dsp import (SR, Track, bell, bp, click, env, finish, glass, hp, lp, modal, musicbox, n_, reseed, reverb, saturate,
                 shape, sweep_noise, sweep_sine, thump, tt, white)

OUT = os.path.normpath(os.path.join(os.path.dirname(__file__), '..', '..', 'public', 'audio'))
SOUNDS = {}


def sound(name, peak, variants=1):
    def deco(fn):
        SOUNDS[name] = (fn, peak, variants)
        return fn

    return deco


def seeded(i, base):
    reseed(base + i * 7919)


@sound('tick', 0.22, 4)
def tick(i):
    seeded(i, 100)
    t = Track(0.05)
    t.add(click(0.012, 1700 + i * 260, 6500, 0.0018))
    t.add(modal([360 + i * 45], [0.012], [0.45], 0.04))

    return t.get()


@sound('click', 0.5, 2)
def click_(i):
    seeded(i, 120)
    t = Track(0.14)
    t.add(click(0.02, 1200, 5000, 0.004))
    t.add(modal([250 + i * 30], [0.03], [0.7], 0.1))
    t.add(modal([2800, 4300], [0.012, 0.008], [0.3, 0.2], 0.05))

    return reverb(t.get(), 0.15, 0.08)


@sound('blip', 0.45)
def blip(i):
    seeded(i, 130)
    t = Track(0.16)
    t.add(modal([900, 1810], [0.05, 0.025], [1, 0.3], 0.15))
    t.add(click(0.006) * 0.3)

    return reverb(t.get(), 0.2, 0.1)


@sound('confirm', 0.55)
def confirm(i):
    seeded(i, 140)
    t = Track(0.55)
    t.add(bell(520, 0.4, 0.18) * 0.8)
    t.add(bell(780, 0.4, 0.22), 0.08)

    return reverb(t.get(), 0.5, 0.2)


@sound('error', 0.6, 2)
def error(i):
    seeded(i, 150)
    t = Track(0.45)

    for f, at in ((180 - i * 12, 0.0), (135 - i * 10, 0.11)):
        tone = modal([f, 2 * f, 3 * f, 4 * f], [0.12, 0.08, 0.05, 0.03], [1, 0.5, 0.3, 0.15], 0.3)
        t.add(lp(tone, 1200), at)
        t.add(thump(f, f * 0.55, 0.12, 0.04) * 0.6, at)

    return reverb(t.get(), 0.25, 0.1)


@sound('hit', 0.8, 2)
def hit(i):
    seeded(i, 160)
    t = Track(0.5)
    t.add(thump(150, 48, 0.25, 0.07))
    t.add(lp(white(0.15), 1800) * env(0.15, 0.04) * 0.5)
    t.add(click(0.01, 1500, 7000, 0.002) * 0.5)
    t.add(modal([320, 610], [0.08, 0.05], [0.15, 0.1], 0.2))

    return reverb(t.get(), 0.3, 0.15)


@sound('found', 0.5)
def found(i):
    seeded(i, 170)
    t = Track(0.5)
    t.add(bell(660, 0.35, 0.15))
    t.add(bell(990, 0.4, 0.2), 0.07)

    return reverb(t.get(), 0.45, 0.2)


@sound('miss', 0.3)
def miss(i):
    seeded(i, 180)
    t = Track(0.13)
    t.add(modal([300, 620], [0.04, 0.02], [1, 0.3], 0.12))
    t.add(click(0.006, 800, 3000) * 0.3)

    return t.get()


@sound('shard', 0.55)
def shard(i):
    seeded(i, 190)
    t = Track(1.2)
    for k, f in enumerate((660, 880, 1320, 1760)):
        t.add(glass(f, 0.9, 0.5), k * 0.07, 0.8)

    return reverb(t.get(), 1.0, 0.3)


@sound('mode', 0.4)
def mode(i):
    seeded(i, 200)
    t = Track(0.2)
    t.add(sweep_noise(400, 2400, 0.12, 1.5) * shape(0.12, 0.01, 0.05, 0.06))
    t.add(modal([400, 800], [0.04, 0.02], [0.6, 0.2], 0.1))

    return t.get()


@sound('boot', 0.45)
def boot(i):
    seeded(i, 210)
    t = Track(0.65)
    t.add(lp(sweep_sine(110, 440, 0.5, (1, 0.4, 0.2)), 1400) * shape(0.5, 0.04, 0.3, 0.16))
    t.add(sweep_noise(300, 2500, 0.5, 0.8) * shape(0.5, 0.05, 0.3, 0.15) * 0.25)
    t.add(thump(90, 50, 0.1, 0.04) * 0.5)

    return reverb(t.get(), 0.3, 0.1)


@sound('glitch', 0.5, 2)
def glitch(i):
    seeded(i, 220)
    t = Track(0.3)
    for k in range(4):
        d = dsp.rng.uniform(0.02, 0.05)
        x = white(d)
        hold = int(dsp.rng.integers(2, 6))
        x = np.repeat(x[::hold], hold)[: len(x)]
        x = np.round(x * 3) / 3
        t.add(hp(x, 600) * 0.4, dsp.rng.uniform(0, 0.2))

    t.add(sweep_sine(2000, 120, 0.14, (1, 0.5)) * shape(0.14, 0.003, 0.03, 0.1) * 0.2)
    return reverb(lp(t.get(), 7000), 0.2, 0.08)


@sound('success', 0.55)
def success(i):
    seeded(i, 230)
    t = Track(1.0)
    for k, f in enumerate((392, 523, 659, 784)):
        t.add(bell(f, 0.6, 0.25), k * 0.09)

    return reverb(t.get(), 0.8, 0.25)


@sound('achieve', 0.5)
def achieve(i):
    seeded(i, 240)
    t = Track(1.4)
    for k, f in enumerate((784, 988, 1175, 1568)):
        t.add(bell(f, 0.8, 0.35), k * 0.09)

    t.add(glass(2349, 0.9, 0.4), 0.4, 0.6)
    t.add(sweep_noise(3000, 8000, 0.5, 3) * shape(0.5, 0.2, 0.1, 0.2) * 0.05, 0.3)

    return reverb(t.get(), 1.0, 0.3)


@sound('gem', 0.45)
def gem(i):
    seeded(i, 250)
    t = Track(0.9)
    t.add(glass(2093, 0.7, 0.3))
    t.add(glass(3136, 0.6, 0.2), 0.05, 0.6)

    return reverb(t.get(), 0.7, 0.28)


@sound('pad', 0.6, 4)
def pad(i):
    seeded(i, 260)
    f = (262, 330, 392, 523)[i]
    t = Track(0.6)
    t.add(modal([f, f * 3.93, f * 9.2], [0.35, 0.08, 0.03], [1, 0.4, 0.15], 0.5))
    t.add(modal([f * 0.5], [0.03], [0.6], 0.06))

    return reverb(t.get(), 0.4, 0.12)

@sound('lampPopDrop', 0.5, 2)
def lamp_drop(i):
    seeded(i, 300)
    t = Track(0.12)
    t.add(click(0.006, 2200, 7000, 0.0015) * 0.7)
    t.add(modal([620 + i * 60], [0.02], [0.6], 0.08))

    return t.get()


@sound('lampPopStrike', 0.5, 2)
def lamp_strike(i):
    seeded(i, 310)
    t = Track(0.2)
    t.add(click(0.012, 1400, 6500, 0.003))
    t.add(modal([2400 + i * 200, 3700], [0.05, 0.03], [0.5, 0.3], 0.15))
    saw = sum(np.sin(2 * np.pi * 100 * k * tt(0.1)) / k for k in range(1, 8))
    t.add(lp(saw, 700) * env(0.1, 0.04) * 0.25)

    return t.get()


@sound('crackle', 0.3, 3)
def crackle(i):
    seeded(i, 320)
    t = Track(0.12)
    t.add(click(0.008, 3000, 9000, 0.001) * 0.6)
    if i:
        t.add(click(0.006, 3500, 9000, 0.001) * 0.4, 0.03 * i)

    return t.get()


def _relay(i, seed=330):
    seeded(i, seed)
    t = Track(0.12)
    t.add(thump(160, 90, 0.03, 0.01) * 0.6)
    t.add(click(0.01, 1500, 7000, 0.0018), 0.004)
    t.add(modal([2300 + i * 150, 4100], [0.012, 0.008], [0.35, 0.2], 0.04), 0.004)
    t.add(click(0.008, 1800, 6000, 0.0015) * 0.4, 0.016)

    return t.get()


@sound('relay', 0.5, 3)
def relay(i):
    return reverb(_relay(i), 0.15, 0.1)


def _degauss():
    t = Track(1.0)
    wob = 1 + 0.5 * np.sin(2 * np.pi * 13 * tt(0.9))
    t.add(sweep_sine(78, 34, 0.9) * env(0.9, 0.35, 0.003) * wob)
    t.add(sweep_sine(156, 68, 0.9) * env(0.9, 0.3, 0.003) * wob * 0.3)
    t.add(lp(white(0.4), 600) * env(0.4, 0.1) * (0.5 + 0.5 * np.sin(2 * np.pi * 40 * tt(0.4))) * 0.25)
    t.add(hp(white(0.05), 300) * env(0.05, 0.015) * 0.5)

    return t.get()


@sound('degauss', 0.8)
def degauss(i):
    seeded(i, 340)
    return reverb(_degauss(), 0.4, 0.1)


@sound('powerOn', 0.8)
def power_on(i):
    seeded(i, 350)
    t = Track(1.6)
    t.add(_degauss())
    t.add(sweep_noise(1500, 9000, 0.24, 1.5) * shape(0.24, 0.01, 0.12, 0.1) * 0.5, 0.42)
    for at in (0.45, 0.52, 0.6):
        t.add(click(0.006, 3000, 9000, 0.001) * 0.4, at)

    t.add(sweep_sine(1500, 13000, 0.6, (1, 0.2)) * shape(0.6, 0.3, 0.1, 0.2) * 0.12, 0.5)
    t.add(click(0.02, 1800, 8000, 0.004) * 0.6, 1.08)
    t.add(thump(100, 55, 0.08, 0.03) * 0.3, 1.08)

    return reverb(t.get(), 0.35, 0.12)


@sound('powerUp', 0.7)
def power_up(i):
    seeded(i, 360)
    t = Track(0.8)
    t.add(thump(90, 38, 0.4, 0.12) * 0.7)
    t.add(sweep_noise(1200, 8000, 0.3, 1.4) * shape(0.3, 0.02, 0.15, 0.1) * 0.5)
    t.add(sweep_sine(1800, 13000, 0.45, (1, 0.2)) * shape(0.45, 0.2, 0.1, 0.15) * 0.12, 0.1)

    return reverb(t.get(), 0.3, 0.1)


@sound('powerDown', 0.8)
def power_down(i):
    seeded(i, 370)
    t = Track(0.55)
    t.add(sweep_sine(9000, 240, 0.4) * shape(0.4, 0.02, 0.2, 0.18) * 0.25)
    t.add(thump(130, 38, 0.34, 0.1) * 0.8)
    t.add(sweep_noise(5000, 300, 0.3, 1.2) * shape(0.3, 0.01, 0.12, 0.17) * 0.5)
    t.add(click(0.02, 2000, 8000, 0.004) * 0.5, 0.36)

    return reverb(t.get(), 0.3, 0.1)


@sound('scanOut', 0.5)
def scan_out(i):
    seeded(i, 380)
    t = Track(0.42)
    t.add(sweep_noise(5000, 700, 0.34, 1.4) * shape(0.34, 0.02, 0.2, 0.12))
    t.add(sweep_sine(1800, 300, 0.3) * shape(0.3, 0.02, 0.15, 0.13) * 0.1)

    return t.get()


@sound('scanIn', 0.5)
def scan_in(i):
    seeded(i, 390)
    t = Track(0.46)
    t.add(sweep_noise(600, 6000, 0.42, 1.4) * shape(0.42, 0.03, 0.25, 0.14))
    t.add(sweep_sine(300, 1800, 0.38) * shape(0.38, 0.03, 0.2, 0.15) * 0.1)

    return t.get()


@sound('doorsClose', 0.8)
def doors_close(i):
    seeded(i, 400)
    t = Track(0.7)
    t.add(sweep_noise(2600, 420, 0.26, 0.8) * shape(0.26, 0.03, 0.12, 0.11) * 0.6)
    t.add(thump(110, 45, 0.25, 0.07), 0.2)
    t.add(modal([190, 430, 910, 1650], [0.25, 0.16, 0.1, 0.06], [0.5, 0.4, 0.25, 0.15], 0.4), 0.2, 0.5)
    t.add(hp(white(0.02), 700) * env(0.02, 0.006) * 0.5, 0.2)

    return reverb(t.get(), 0.5, 0.2)


@sound('doorsOpen', 0.55)
def doors_open(i):
    seeded(i, 410)
    t = Track(0.5)
    t.add(_relay(0, 411) * 0.8)
    t.add(sweep_noise(450, 2800, 0.3, 0.8) * shape(0.3, 0.04, 0.1, 0.16) * 0.45, 0.02)
    t.add(thump(90, 50, 0.12, 0.04) * 0.4)

    return reverb(t.get(), 0.3, 0.12)


@sound('ratchet', 0.5)
def ratchet(i):
    seeded(i, 420)
    t = Track(0.6)
    for k, at in enumerate((0, 0.04, 0.085, 0.135, 0.195, 0.268, 0.36)):
        t.add(click(0.01, 1800 - k * 60, 7000, 0.0015) * 0.8, at)
        t.add(modal([1600 - k * 60, 3100 - k * 100], [0.006, 0.004], [0.5, 0.3], 0.03), at)

    t.add(thump(300, 150, 0.07, 0.03) * 0.8, 0.44)
    t.add(modal([620, 1500], [0.04, 0.02], [0.4, 0.2], 0.1), 0.44, 0.6)

    return reverb(t.get(), 0.2, 0.1)


@sound('mountOk', 0.45)
def mount_ok(i):
    seeded(i, 430)
    t = Track(0.5)
    t.add(bell(1568, 0.25, 0.1) * 0.7)
    t.add(bell(2093, 0.3, 0.14) * 0.7, 0.06)

    return reverb(t.get(), 0.4, 0.15)


@sound('rackOn', 0.45, 3)
def rack_on(i):
    seeded(i, 440)
    f = 392 * (1, 1.26, 1.498)[i]
    t = Track(0.4)
    t.add(modal([f, f * 5.4], [0.14, 0.03], [1, 0.2], 0.3))
    t.add(click(0.008, 2500, 8000, 0.0015) * 0.3)

    return reverb(t.get(), 0.3, 0.1)


@sound('sting1', 0.7)
def sting1(i):
    seeded(i, 450)
    t = Track(0.6)
    t.add(thump(150, 46, 0.24, 0.07))
    t.add(lp(bp(white(0.09), 250, 5000), 5000) * env(0.09, 0.03) * 0.6)
    t.add(modal([180, 420], [0.05, 0.03], [0.4, 0.2], 0.12))

    return reverb(t.get(), 0.5, 0.18)


@sound('sting2', 0.7)
def sting2(i):
    seeded(i, 460)
    t = Track(1.4)
    t.add(_relay(1, 461))
    saw = sum(np.sin(2 * np.pi * 196 * k * tt(0.5)) / k for k in range(1, 9))
    t.add(lp(saw, 800) * shape(0.5, 0.03, 0.35, 0.12) * 0.35, 0.02)
    t.add(_relay(2, 462), 0.55)
    t.add(bell(880, 0.4, 0.12) * 0.5, 0.55)

    return reverb(t.get(), 0.4, 0.12)


def _soft(f, sec, tau, attack):
    return glass(f, sec, tau) * np.minimum(1.0, tt(sec) / attack)


@sound('sting3', 0.7)
def sting3(i):
    seeded(i, 470)
    t = Track(3.2)
    for k, f in enumerate((392, 587, 784, 1175)):
        t.add(_soft(f, 1.8, 0.7, 0.28), k * 0.12, 0.7)

    t.add(sweep_noise(2000, 6500, 1.2, 3) * shape(1.2, 0.4, 0.3, 0.5) * 0.12)
    return reverb(t.get(), 1.8, 0.45)


@sound('sting4', 0.7)
def sting4(i):
    seeded(i, 480)
    t = Track(1.0)
    t.add(bp(white(0.35), 300, 3400) * shape(0.35, 0.01, 0.25, 0.09) * 0.5)
    t.add(sweep_noise(800, 3500, 0.3, 1.5) * shape(0.3, 0.02, 0.2, 0.08) * 0.3)
    for at in (0.4, 0.55):
        beep = np.sin(2 * np.pi * 1000 * tt(0.07)) * shape(0.07, 0.004, 0.05, 0.016)
        t.add(saturate(bp(beep, 300, 3400), 1.5) * 0.4, at)

    return reverb(t.get(), 0.3, 0.1)


# ----------------------------------------------------------------------------------------------- act II
@sound('lightGreen', 0.5)
def light_green(i):
    seeded(i, 500)
    t = Track(0.5)
    t.add(_relay(0, 501))
    t.add(bell(784, 0.35, 0.14) * 0.5, 0.02)

    return reverb(t.get(), 0.3, 0.1)


@sound('lightRed', 0.55)
def light_red(i):
    seeded(i, 510)
    t = Track(0.45)
    t.add(_relay(1, 511))
    t.add(thump(100, 60, 0.12, 0.04) * 0.5, 0.02)
    t.add(modal([140, 310], [0.1, 0.05], [0.6, 0.3], 0.25) * 0.5, 0.02)

    return reverb(t.get(), 0.25, 0.1)


@sound('step', 0.5, 4)
def step(i):
    seeded(i, 520)
    t = Track(0.25)
    t.add(thump(130 + i * 6, 55, 0.08, 0.03))
    t.add(bp(white(0.05), 400, 2500) * env(0.05, 0.012) * 0.6)
    t.add(modal([700 + i * 70, 1300 + i * 40, 2100, 3400], [0.06, 0.05, 0.04, 0.03], [0.15, 0.12, 0.08, 0.05], 0.15), 0.004)

    return reverb(lp(t.get(), 9000), 0.25, 0.12)


def _glass_tap(base, i):
    t = Track(0.4)
    t.add(click(0.008, 3000, 8000, 0.002) * 0.5)
    t.add(modal([300, 520], [0.02, 0.012], [0.5, 0.2], 0.06))
    t.add(glass(base, 0.35, 0.2) * 0.6, 0.002)

    return reverb(t.get(), 0.4, 0.15)


@sound('glassTapL', 0.5, 2)
def glass_tap_l(i):
    seeded(i, 530)
    return _glass_tap(1500 + i * 40, i)


@sound('glassTapR', 0.5, 2)
def glass_tap_r(i):
    seeded(i, 540)
    return _glass_tap(1750 + i * 40, i)


@sound('glassStep', 0.5, 6)
def glass_step(i):
    seeded(i, 550)
    t = Track(0.5)
    t.add(thump(140, 80, 0.06, 0.025) * 0.7)
    t.add(bp(white(0.03), 600, 3000) * env(0.03, 0.008) * 0.4)
    t.add(glass(523 * 2 ** (i / 6), 0.4, 0.18) * 0.6, 0.004)

    return reverb(t.get(), 0.4, 0.16)


@sound('glassCrack', 0.85)
def glass_crack(i):
    seeded(i, 560)
    t = Track(1.1)
    t.add(hp(white(0.06), 2500) * env(0.06, 0.012))
    for _ in range(10):
        at = dsp.rng.uniform(0.04, 0.45)
        t.add(click(0.008, 2500, 9000, 0.0012) * dsp.rng.uniform(0.2, 0.6), at)
        f = dsp.rng.uniform(2000, 6000)
        t.add(modal([f, f * 1.9], [dsp.rng.uniform(0.03, 0.08), 0.03], [0.3, 0.15], 0.15), at, dsp.rng.uniform(0.2, 0.5))

    t.add(thump(90, 36, 0.3, 0.09) * 0.8, 0.04)
    t.add(sweep_noise(4200, 600, 0.6, 1.0) * shape(0.6, 0.02, 0.2, 0.38) * 0.2, 0.06)

    return reverb(t.get(), 0.6, 0.22)


@sound('anomaly', 0.45)
def anomaly(i):
    seeded(i, 570)
    t = Track(1.0)
    trem = 1 + 0.3 * np.sin(2 * np.pi * 6 * tt(0.5))
    t.add(sweep_sine(880, 1320, 0.5) * shape(0.5, 0.12, 0.1, 0.28) * 0.3 * trem)
    t.add(sweep_sine(893, 1290, 0.5) * shape(0.5, 0.12, 0.1, 0.28) * 0.25 * trem)
    t.add(hp(white(0.3), 5000) * shape(0.3, 0.1, 0.05, 0.15) * 0.05, 0.1)

    return reverb(t.get(), 1.0, 0.35)


@sound('stamp', 0.75, 2)
def stamp(i):
    seeded(i, 580)
    t = Track(0.45)
    t.add(thump(130 + i * 12, 50, 0.2, 0.06))
    t.add(bp(white(0.06), 300, 6000) * env(0.06, 0.02) * 0.5)
    t.add(modal([180, 410], [0.05, 0.03], [0.4, 0.2], 0.1))

    return reverb(t.get(), 0.3, 0.12)


@sound('unstamp', 0.3)
def unstamp(i):
    seeded(i, 590)
    return bp(white(0.12), 1800, 6500) * shape(0.12, 0.02, 0.03, 0.07) * 0.35


@sound('paper', 0.35, 3)
def paper(i):
    seeded(i, 600)
    x = white(0.2) * (dsp.rng.random(n_(0.2)) > 0.96)

    return bp(x, 2000, 7000) * shape(0.2, 0.01, 0.08, 0.1) * 3


@sound('decayBurst', 0.45, 3)
def decay_burst(i):
    seeded(i, 610)
    t = Track(0.3)
    d = 0.05 + i * 0.01
    x = white(d)
    hold = 2 + i
    x = np.repeat(x[::hold], hold)[: len(x)]
    t.add(np.round(hp(x, 1500) * 3) / 3 * 0.4)
    t.add(sweep_sine(3200, 180, 0.11, (1, 0.5)) * shape(0.11, 0.003, 0.03, 0.08) * 0.15)
    t.add(lp(white(0.05), 2500) * env(0.05, 0.015) * 0.25, 0.12)

    return reverb(t.get(), 0.2, 0.08)


BPM = 96
BEAT = 60 / BPM
BARS = 8
LENGTH = BARS * 4 * BEAT


def midi(m):
    return 440 * 2 ** ((m - 69) / 12)


MELODY = [
    [(76, 1), (72, 1), (69, 1), (72, 1)],
    [(76, 1), (72, 1), (69, 1), (64, 1)],
    [(77, 1), (74, 1), (69, 1), (74, 1)],
    [(76, 1), (74, 1), (72, 1), (69, 1)],
    [(77, 1), (72, 1), (69, 1), (72, 1)],
    [(79, 1), (76, 1), (72, 1), (76, 1)],
    [(76, 1), (71, 1), (68, 1), (71, 1)],
    [(69, 1), (72, 1), (76, 2)],
]
BASS = [45, 45, 50, 45, 41, 48, 52, 45]


def render_music():
    reseed(777)
    tail = 3.5
    t = Track(LENGTH + tail)
    for bar, notes in enumerate(MELODY):
        at = bar * 4 * BEAT

        for m, beats in notes:
            vel = dsp.rng.uniform(0.8, 1.0)
            when = at + dsp.rng.normal(0, 0.006)
            tone = musicbox(midi(m), 3.0, tau=dsp.rng.uniform(1.1, 1.6))
            t.add(tone, max(0, when), 0.5 * vel)
            t.add(musicbox(midi(m + 12), 2.0, tau=0.9), max(0, when + 0.75 * BEAT), 0.12 * vel)
            at += beats * BEAT

        root = midi(BASS[bar])
        for beat, gain in ((0, 0.55), (2, 0.3)):
            b = modal([root, 2 * root, 3 * root], [0.7, 0.4, 0.2], [1, 0.4, 0.15], 1.6)
            t.add(b, bar * 4 * BEAT + beat * BEAT, gain)

        for beat in (1, 3):
            at_tick = bar * 4 * BEAT + beat * BEAT
            t.add(modal([1100, 2300], [0.02, 0.01], [0.5, 0.2], 0.08), at_tick, 0.12)
            t.add(click(0.006, 2000, 7000), at_tick, 0.05)

    dry = t.get()
    stereo = []

    for k, seed in enumerate((31, 32)):
        reseed(seed)
        ir = dsp.make_ir(1.7, 0.02, 4500)
        wet = np.convolve if False else None
        from scipy import signal as sg

        y = sg.fftconvolve(dry, ir)
        mix = np.zeros(len(y))
        mix[: len(dry)] = dry
        stereo.append(mix * 0.75 + y * 0.55)

    out = np.stack(stereo, axis=1)
    n = n_(LENGTH)
    folded = out[:n].copy()
    over = out[n:]
    folded[: len(over)] += over[: n]
    f = 0.5
    tw = np.arange(n) / SR + (0.0025 / (2 * np.pi * f)) * np.sin(2 * np.pi * f * np.arange(n) / SR)
    idx = np.arange(n) / SR
    folded = np.stack([np.interp(tw % LENGTH, idx, folded[:, c]) for c in range(2)], axis=1)
    folded -= folded.mean(axis=0)

    return folded / np.max(np.abs(folded)) * 0.8


def write_ogg(name, x):
    x = np.asarray(x)
    pcm = np.clip(x * 32767, -32768, 32767).astype(np.int16)

    with tempfile.TemporaryDirectory() as tmp:
        wav = os.path.join(tmp, name + '.wav')
        wavfile.write(wav, SR, pcm)
        out = os.path.join(OUT, name + '.ogg')
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', wav, '-c:a', 'libvorbis', '-q:a', '5', out], check=True)

    return out


def main():
    only = [a.lower() for a in sys.argv[1:]]
    os.makedirs(OUT, exist_ok=True)
    count = 0

    for name, (fn, peak, variants) in SOUNDS.items():
        for i in range(variants):
            file = name if variants == 1 else f'{name}{i}' if name in ('pad', 'rackOn', 'glassStep') else f'{name}{i + 1}'
            if only and not any(w in file.lower() for w in only):
                continue

            write_ogg(file, finish(fn(i), peak))
            count += 1

    if not only or any(w in 'musredlight' for w in only):
        music = render_music()
        write_ogg('musRedLight', music)
        count += 1

    print(f'{count} files written to {OUT}')


if __name__ == '__main__':
    main()
