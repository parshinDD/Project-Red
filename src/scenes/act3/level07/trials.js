export const POINTS = 12;
export const MIN = 0;
export const MAX = 5;

export const STATS = [
    { id: "str", name: "Сила" },
    { id: "dex", name: "Ловкость" },
    { id: "int", name: "Интеллект" },
    { id: "luck", name: "Удача" },
];

export const START = { str: 0, dex: 0, int: 0, luck: 0 };

export const TRIALS = [
    {
        id: "blade",
        name: "Испытание клинка",
        blurb: "Дуэль на узком мосту.",
        checks: [
            {
                ok: (s) => s.str === s.dex + 2,
                fail: () => "Проверка ловкости не пройдена.",
            },
        ],
    },
    {
        id: "shadows",
        name: "Испытание теней",
        blurb: "Запертый сейф и длинный коридор.",
        checks: [
            {
                ok: (s) => s.dex + s.luck === 4,
                fail: () => "Проверка удачи не пройдена.",
            },
        ],
    },
    {
        id: "mage",
        name: "Испытание мага",
        blurb: "Три вопроса, у которых есть только один верный ответ.",
        checks: [
            {
                ok: (s) => s.int === 2 * s.luck,
                fail: () =>
                    "Испытание мага провалено: интеллект не в ладах с удачей.",
            },
            {
                ok: (s) => s.str + s.int === 8,
                fail: (s) =>
                    s.str + s.int < 8
                        ? "Недостаточно очков для прохождения испытания мага."
                        : "В испытание мага вложено слишком много очков.",
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
