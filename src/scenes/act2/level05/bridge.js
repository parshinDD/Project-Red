export const PAIRS = 6;
export const SOLUTION = ["L", "R", "R", "L", "R", "L"];

const lefts = (p) => p.filter((x) => x === "L").length;

export const RULES = [
    {
        id: "p2-not-left",
        text: "Панель 2 не может быть левой.",
        panels: [2],
        ok: (p) => p[1] !== "L",
    },
    {
        id: "p2-eq-p3",
        text: "Панель 2 должна совпадать с панелью 3.",
        panels: [2, 3],
        ok: (p) => p[1] === p[2],
    },
    {
        id: "p1-ne-p2",
        text: "Панель 1 должна отличаться от панели 2.",
        panels: [1, 2],
        ok: (p) => p[0] !== p[1],
    },
    {
        id: "three-left",
        text: "Ровно три панели - левые.",
        panels: [1, 2, 3, 4, 5, 6],
        ok: (p) => lefts(p) === 3,
    },
    {
        id: "no-adjacent",
        text: "Никакие две левые панели не стоят рядом.",
        panels: [1, 2, 3, 4, 5, 6],
        ok: (p) => p.every((x, i) => !(x === "L" && p[i + 1] === "L")),
    },
    {
        id: "p4-eq-p6",
        text: "Панель 4 должна совпадать с панелью 6.",
        panels: [4, 6],
        ok: (p) => p[3] === p[5],
    },
];

export const firstViolation = (picks) =>
    RULES.find((r) => !r.ok(picks)) ?? null;
