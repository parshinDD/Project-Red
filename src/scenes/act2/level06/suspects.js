export const SUSPECTS = [
    { id: "A", says: "B is lying.", holds: (liar) => liar.B },
    { id: "B", says: "C is lying.", holds: (liar) => liar.C },
    { id: "C", says: "D is lying.", holds: (liar) => liar.D },
    { id: "D", says: "E is lying.", holds: (liar) => liar.E },
    {
        id: "E",
        says: "A and B are both liars.",
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
