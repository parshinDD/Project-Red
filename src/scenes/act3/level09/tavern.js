export const norm = (value) =>
    value
        .toLowerCase()
        .replace(/ё/g, "е")
        .replace(/[^a-zа-я0-9 ]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();

export const GREETING = [
    "Welcome, traveller.",
    "We don't accept gold here.",
    "We accept correct answers.",
    "The exchange rate is terrible.",
];

export const NPCS = [
    {
        id: "keeper",
        name: "Innkeeper",
        index: 1,
        lines: [
            "I remember the place where this story began.",
            "It wasn't a dungeon.",
            "It wasn't a tavern.",
            "Where was it?",
        ],
        accepts: (a) => /серебрян|serebr/.test(a),
        thanks: ["Yes. That is the place.", "MEMORY INDEX: 01"],
    },
    {
        id: "merchant",
        name: "Merchant",
        index: 2,
        lines: [
            "Every adventurer has a weakness.",
            "Some choose gold.",
            "Some choose legendary weapons.",
            "One particular adventurer has a much more predictable preference.",
        ],
        accepts: (a) => /креветк|shrimp|prawn/.test(a),
        thanks: ["Predictable. Delicious.", "MEMORY INDEX: 02"],
    },
    {
        id: "mage",
        name: "Mage",
        index: 3,
        lines: [
            "I can predict many possible futures.",
            "There is one plan I have heard about more than once.",
            "What is it?",
        ],
        accepts: (a) => /япони|japan|nihon/.test(a),
        thanks: ["Yes. That one comes true most often.", "MEMORY INDEX: 03"],
    },
];

export const WRONG = [
    "That is not it.",
    "Not quite. The exchange rate is still terrible.",
    "No. Think about it a little longer.",
    "Close, perhaps. But no.",
];

export const check = (npc, answer) => npc.accepts(norm(answer));
