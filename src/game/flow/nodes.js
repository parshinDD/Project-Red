export const ACTS = {
    0: { roman: "", name: "PROLOGUE" },
    1: { roman: "I", name: "CLOSED BETA" },
    2: { roman: "II", name: "SURVIVAL" },
    3: { roman: "III", name: "ISEKAI" },
    4: { roman: "IV", name: "SCOUT CORPS & RED MAGIC" },
    5: { roman: "", name: "FINAL" },
};

const level = (n, act, theme, title, tip) => ({
    id: `level.${n}`,
    kind: "level",
    level: n,
    act,
    theme,
    title,
    tip,
});

export const NODES = [
    {
        id: "prologue.boot",
        kind: "prologue",
        act: 0,
        theme: "crt",
        surface: "crt",
        mood: "dark",
        title: "BOOT",
    },
    {
        id: "prologue.agreement",
        kind: "prologue",
        act: 0,
        theme: "crt",
        surface: "crt",
        mood: "contract",
        title: "AGREEMENT",
    },
    {
        id: "prologue.welcome",
        kind: "prologue",
        act: 0,
        theme: "crt",
        surface: "crt",
        mood: "online",
        title: "WELCOME",
    },

    level(
        1,
        1,
        "pixel",
        "BUG HUNT",
        "Click anything that looks wrong. Hints are free.",
    ),
    level(
        2,
        1,
        "log",
        "PATCH NOTES",
        "Read the entries carefully. Wrong answers cost nothing.",
    ),
    level(
        3,
        1,
        "minimal",
        "MEMORY",
        "Each mistake costs 1 HP. The sequence is replayed after an error.",
    ),
    {
        id: "act.1.complete",
        kind: "actComplete",
        act: 1,
        theme: "minimal",
        title: "ACT COMPLETE",
    },

    level(4, 2, "industrial", "RED LIGHT, GREEN LIGHT"),
    level(5, 2, "arena", "GLASS BRIDGE"),
    level(6, 2, "dossier", "LIAR VOTE"),
    {
        id: "act.2.complete",
        kind: "actComplete",
        act: 2,
        theme: "arena",
        title: "ACT COMPLETE",
    },

    level(7, 3, "fantasy", "CHARACTER CREATION"),
    level(8, 3, "fantasy", "FAMILIARS"),
    level(9, 3, "tavern", "TAVERN"),
    {
        id: "act.3.complete",
        kind: "actComplete",
        act: 3,
        theme: "tavern",
        title: "ACT COMPLETE",
    },

    level(10, 4, "military", "SCOUT CIPHER"),
    level(11, 4, "tactical", "TITAN PROTOCOL"),
    level(12, 4, "signal", "RED MAGIC SIGNAL"),

    {
        id: "final.assembly",
        kind: "final",
        act: 5,
        theme: "crt",
        surface: "crt",
        mood: "alarm",
        title: "ASSEMBLY",
    },
    {
        id: "final.verify",
        kind: "final",
        act: 5,
        theme: "crt",
        surface: "crt",
        mood: "online",
        title: "ARCHIVE CHECK",
    },
    {
        id: "final.report",
        kind: "final",
        act: 5,
        theme: "crt",
        surface: "crt",
        mood: "final",
        title: "FINAL REPORT",
    },
];

export const LEVELS = NODES.filter((n) => n.kind === "level");
export const levelsOfAct = (act) => LEVELS.filter((n) => n.act === act);

const BY_ID = new Map(NODES.map((n, i) => [n.id, { ...n, index: i }]));

export const getNode = (id) => BY_ID.get(id);
export const getNextNodeId = (id) =>
    NODES[BY_ID.get(id)?.index + 1]?.id ?? null;
export const pad2 = (n) => String(n).padStart(2, "0");

export function nodeLabel(node) {
    if (!node) return "";

    if (node.kind === "prologue") return "PROLOGUE";

    if (node.kind === "final") return `FINAL — ${node.title}`;

    const act = ACTS[node.act];
    if (node.kind === "actComplete") return `ACT ${act.roman} · COMPLETE`;

    return `ACT ${act.roman} · LEVEL ${pad2(node.level)} — ${node.title}`;
}
