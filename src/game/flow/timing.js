export const PACE = 1;
const p = (ms) => Math.round(ms * PACE);

export const TIMING = {
    fade: { cover: 420, hold: 120, exit: 420 },
    level: { cover: 280, hold: p(2200), exit: 300 },
    act: { cover: 200, hold: p(5000), exit: 700 },
};

export const LEVEL_CUES = { roll: p(40), rollMs: 420, ok: p(520) };

export const ACT_CUES = {
    title: p(400),
    name: p(760),
    roster: p(1100),
    rosterStep: p(130),
    log: p(1550),
    logStep: p(150),
};

export const TITLE_FLICKER = {
    ms: 640,
    keys: [
        [0, 0],
        [0.08, 0.9],
        [0.15, 0.1],
        [0.3, 0.75],
        [0.4, 0.05],
        [0.55, 1],
        [0.62, 0.6],
        [0.7, 1],
        [1, 1],
    ],
};
