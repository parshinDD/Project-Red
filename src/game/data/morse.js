export const MORSE = {
    A: ".-",
    B: "-...",
    C: "-.-.",
    D: "-..",
    E: ".",
    F: "..-.",
    G: "--.",
    H: "....",
    I: "..",
    J: ".---",
    K: "-.-",
    L: ".-..",
    M: "--",
    N: "-.",
    O: "---",
    P: ".--.",
    Q: "--.-",
    R: ".-.",
    S: "...",
    T: "-",
    U: "..-",
    V: "...-",
    W: ".--",
    X: "-..-",
    Y: "-.--",
    Z: "--..",
    0: "-----",
    1: ".----",
    2: "..---",
    3: "...--",
    4: "....-",
    5: ".....",
    6: "-....",
    7: "--...",
    8: "---..",
    9: "----.",
};

const rows = (keys, size) => {
    const out = [];

    for (let i = 0; i < keys.length; i += size)
        out.push(
            keys
                .slice(i, i + size)
                .map((k) => `${k} ${MORSE[k]}`)
                .join("  ·  "),
        );

    return out.join("\n");
};

const LETTERS = Object.keys(MORSE).filter((k) => /[A-Z]/.test(k));
const DIGITS = Object.keys(MORSE).filter((k) => /[0-9]/.test(k));

export const MORSE_TABLE_TEXT = [
    "Точка - короткий сигнал. Тире - длинный сигнал, в три раза длиннее. Пауза разделяет буквы.",
    rows(LETTERS, 4),
    rows(DIGITS, 5),
].join("\n\n");

export const UNIT = 0.15;

export function morseSchedule(text, unit = UNIT) {
    const beeps = [];
    let t = 0;

    Array.from(text.toUpperCase()).forEach((ch, li) => {
        if (li > 0) t += unit * 3;

        Array.from(MORSE[ch] ?? "").forEach((sym, si) => {
            if (si > 0) t += unit;

            const dur = sym === "." ? unit : unit * 3;

            beeps.push({ at: t, dur });
            t += dur;
        });
    });

    return { beeps, total: t };
}
