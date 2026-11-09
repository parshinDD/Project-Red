export const PAIRS = 6;
export const SOLUTION = ["L", "R", "R", "L", "R", "L"];

const lefts = (p) => p.filter((x) => x === "L").length;

export const RULES = [
    {
        id: "p2-not-left",
        text: "Panel 2 cannot be LEFT.",
        panels: [2],
        ok: (p) => p[1] !== "L",
    },
    {
        id: "p2-eq-p3",
        text: "Panel 2 must match Panel 3.",
        panels: [2, 3],
        ok: (p) => p[1] === p[2],
    },
    {
        id: "p1-ne-p2",
        text: "Panel 1 must differ from Panel 2.",
        panels: [1, 2],
        ok: (p) => p[0] !== p[1],
    },
    {
        id: "three-left",
        text: "Exactly three panels are LEFT.",
        panels: [1, 2, 3, 4, 5, 6],
        ok: (p) => lefts(p) === 3,
    },
    {
        id: "no-adjacent",
        text: "No two LEFT panels are adjacent.",
        panels: [1, 2, 3, 4, 5, 6],
        ok: (p) => p.every((x, i) => !(x === "L" && p[i + 1] === "L")),
    },
    {
        id: "p4-eq-p6",
        text: "Panel 4 must match Panel 6.",
        panels: [4, 6],
        ok: (p) => p[3] === p[5],
    },
];

export const firstViolation = (picks) =>
    RULES.find((r) => !r.ok(picks)) ?? null;
