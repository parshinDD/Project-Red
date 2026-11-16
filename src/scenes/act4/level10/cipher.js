export const CIPHERTEXT = "ФЕСДСЖГ";
export const ANSWER = "СВОБОДА";

export const QUOTE = [
    "Три стены, три шага.",
    "Не ищи отправителя там,",
    "где заканчивается сигнал.",
];

export const LENGTH = Array.from(CIPHERTEXT).length;

export const isAnswer = (letters) => letters.join("").toUpperCase() === ANSWER;
