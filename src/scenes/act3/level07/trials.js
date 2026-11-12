export const POINTS = 12;
export const MIN = 0;
export const MAX = 5;

export const STATS = [
    { id: "str", name: "Strength" },
    { id: "dex", name: "Dexterity" },
    { id: "int", name: "Intelligence" },
    { id: "luck", name: "Luck" },
];

export const START = { str: 0, dex: 0, int: 0, luck: 0 };

export const TRIALS = [
    {
        id: "blade",
        name: "Trial of the Blade",
        blurb: "A duel on a narrow bridge.",
        checks: [
            {
                ok: (s) => s.str === s.dex + 2,
                fail: () => "Dexterity check failed.",
            },
        ],
    },
    {
        id: "shadows",
        name: "Trial of Shadows",
        blurb: "A locked vault and a long corridor.",
        checks: [
            {
                ok: (s) => s.dex + s.luck === 4,
                fail: () => "Luck check failed.",
            },
        ],
    },
    {
        id: "mage",
        name: "Mage's Trial",
        blurb: "Three questions that only have a correct answer.",
        checks: [
            {
                ok: (s) => s.int === 2 * s.luck,
                fail: () =>
                    "The mage's trial failed: intelligence is out of tune with luck.",
            },
            {
                ok: (s) => s.str + s.int === 8,
                fail: (s) =>
                    s.str + s.int < 8
                        ? "Not enough points to pass the mage's trial."
                        : "Too many points are invested in the mage's trial.",
            },
        ],
    },
];

export const spent = (stats) => stats.str + stats.dex + stats.int + stats.luck;

export function runTrials(stats) {
    return TRIALS.map((t) => ({
        id: t.id,
        name: t.name,
        failures: t.checks
            .filter((c) => !c.ok(stats))
            .map((c) => c.fail(stats)),
    }));
}
