export const SUSPECTS = [
    { id: "A", says: "B лжет.", holds: (liar) => liar.B },
    { id: "B", says: "C лжет.", holds: (liar) => liar.C },
    { id: "C", says: "D лжет.", holds: (liar) => liar.D },
    { id: "D", says: "E лжет.", holds: (liar) => liar.E },
    {
        id: "E",
        says: "A и B оба лжецы.",
        holds: (liar) => liar.A && liar.B,
    },
];
export const ANSWER = ["A", "C", "E"];

export function firstContradiction(marked) {
    const liar = Object.fromEntries(
        SUSPECTS.map((s) => [s.id, marked.includes(s.id)]),
    );

    return SUSPECTS.find((s) => liar[s.id] === Boolean(s.holds(liar))) ?? null;
}
