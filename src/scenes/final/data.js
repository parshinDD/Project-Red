export const FRAGMENTS = [
    { level: 1, symbol: "S", pos: 10 },
    { level: 2, symbol: "2", pos: 12 },
    { level: 3, symbol: "T", pos: 4 },
    { level: 4, symbol: "E", pos: 2 },
    { level: 5, symbol: "R", pos: 9 },
    { level: 6, symbol: "F", pos: 11 },
    { level: 7, symbol: "E", pos: 8 },
    { level: 8, symbol: "D", pos: 3 },
    { level: 9, symbol: "T", pos: 7 },
    { level: 10, symbol: "R", pos: 1 },
    { level: 11, symbol: "E", pos: 5 },
    { level: 12, symbol: "S", pos: 6 },
];

export const KEY_LETTERS = "REDTESTERSF2";
export const ARCHIVE_KEY = "RED-TESTER-SF2";

export const KEY_GROUPS = [3, 6, 3];

export const normalizeKey = (value) =>
    String(value ?? "")
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .slice(0, KEY_LETTERS.length);

export const isArchiveKey = (value) => normalizeKey(value) === KEY_LETTERS;

export function keySlots(letters) {
    const cells = [];
    let i = 0;

    KEY_GROUPS.forEach((size, g) => {
        for (let k = 0; k < size; k++) {
            cells.push({
                char: letters[i] ?? "",
                idx: i,
                hyphen: false,
                group: g,
            });
            i++;
        }

        if (g < KEY_GROUPS.length - 1)
            cells.push({ char: "-", hyphen: true, group: g });
    });

    return cells;
}

export const FINAL_LINES = [
    { text: "I could have just given you the package.", pause: 900 },
    {
        text: "I could have put everything into a box and called it a gift.",
        pause: 900,
    },
    {
        text: "Instead, I built an entire game and made you work for it.",
        pause: 900,
    },
    {
        text: "In my defense, the original plan was considerably shorter.",
        pause: 1250,
    },
    { text: "Thank you for playing.", pause: 1500, beat: "thanks" },
    {
        text: "You were the only player this build was ever meant for.",
        pause: 1600,
        beat: "only",
    },
    { text: "END OF TEST.", pause: 1100, tone: "system" },
    { text: "There is no next level.", pause: 2400, tone: "system" },
];

export const PACKAGE_LINE = "There is, however, a package waiting for you.";
