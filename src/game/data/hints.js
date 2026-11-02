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
};

export const hintCount = (level) => {
    const h = HINTS[level];
    return Array.isArray(h) ? h.length : h ? 5 : 0;
};
