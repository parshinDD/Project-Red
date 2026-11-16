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
    7: [
        "You have 12 points in total, and every one of them has to be spent. Each stat is between 0 and 5.",
        "Whatever ties the four stats together is written down in your journal. Pick one stat and follow it through: Dexterity and Luck add up to 4, so once one is chosen, the other is fixed.",
        "Try Luck = 2 and follow the conditions from there.",
    ],
    8: [
        "Read both entries. Each describes one of the two familiars, and not the same one.",
        "One entry is about a creature that avoids contact and hides the traces of its visits. The other is confident, but sometimes falls.",
        "The observation question needs nothing but the two descriptions: which one prefers evasion?",
    ],
    9: [
        "You can visit the three characters in any order. An answer is a word or a short phrase, in English or in Russian.",
        "Each question is personal: a place, a habit, a plan.",
        "The place is not a dungeon and not a tavern. The habit is not gold and not a legendary weapon. The plan has been mentioned more than once.",
    ],
    10: [
        "Every letter of the message was changed in exactly the same way.",
        "Think of the alphabet as a line: each letter moved along it by the same number of steps. Three walls, three steps.",
        "Move every letter three steps back along the alphabet.",
    ],
    11: [
        "There is no report about the wall: it is not a titan. Only three objects are described.",
        "Match the reports by their signs first: steam, plates, crystal.",
    ],
    12: [
        "The signal is Morse code. It can be replayed as often as you need.",
        "You will need a Morse table. Your journal may already hold one.",
    ],
};

export const hintCount = (level) => {
    const h = HINTS[level];
    return Array.isArray(h) ? h.length : h ? 5 : 0;
};
