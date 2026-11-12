const COMMON = {
    build: [["BUILD_02-12", "BUILD_??-??"]],
    hp: [["HP", "??"]],
    hint: [["Hint", "None"]],
    menu: [["Menu", "Stay"]],
    journal: [["Journal", "Records"]],
    objective: [["Objective", "Directive"]],
    where: [
        ["LEVEL", "ERROR"],
        ["ACT", "???"],
    ],
};

const WHERE_BY_LEVEL = {
    4: [["GREEN LIGHT", "RED LIGHT"]],
    5: [["BRIDGE", "ABYSS"]],
    6: [["VOTE", "LIES"]],
    7: [["CREATION", "DELETION"]],
    8: [["FAMILIARS", "RELATIVES"]],
    9: [["TAVERN", "SERVER"]],
};

const SKIN = {
    3: {
        build: [["BUILD", "REALM"]],
        where: [["LEVEL", "QUEST"]],
        hint: [["Hint", "Rune"]],
        menu: [["Menu", "Camp"]],
        journal: [["Journal", "Scrolls"]],
        objective: [["Objective", "Quest"]],
    },
};

export const skinOf = (act, key) => SKIN[act]?.[key] ?? [];
const WHERE_COMPLETE = [["COMPLETE", "UNSTABLE"]];

export function swapsFor(key, node) {
    const base = COMMON[key] ?? [];
    if (key !== "where" || !node) return base;

    if (node.kind === "actComplete") return [...base, ...WHERE_COMPLETE];

    return [...base, ...(WHERE_BY_LEVEL[node.level] ?? [])];
}
