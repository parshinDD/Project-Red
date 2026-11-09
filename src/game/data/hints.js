import { BUGS } from "@/scenes/act1/level01/bugs";

export const HINTS = {
    1: (progress) => {
        const found = progress?.found ?? [];
        const next = BUGS.find((b) => !found.includes(b.id));
        return next
            ? next.hint
            : "All anomalies are logged. Order the tags by defect number, not by discovery.";
    },

    2: [
        "Read the entries in order.",
        "The first character of each line matters.",
        "R-E-S-P-A-W-N.",
    ],

    3: ["REPLAY SEQUENCE repeats the current sequence at no cost."],
    4: [
        "Hold SPACE (or the button) to move. Let go the moment the light turns red.",
        "You only lose HP for moving on red. Standing still is always safe.",
        "Running out of time costs nothing. You can repeat the test.",
    ],
    5: [
        "Start with the first and second panels.",
        "Panel 2 and Panel 3 must match. Panel 2 cannot be left.",
        "LEFT - RIGHT - RIGHT - LEFT - RIGHT - LEFT.",
    ],
    6: [
        "Assume A tells the truth and follow the chain: who lies, who is honest.",
        "If A is honest, E ends up contradicting A. So A cannot be honest.",
        "A, C, E.",
    ],
};

export const hintCount = (level) => {
    const h = HINTS[level];
    return Array.isArray(h) ? h.length : h ? 5 : 0;
};
