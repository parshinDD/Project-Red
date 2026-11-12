import { levelsOfAct } from "./nodes";

export const DECAY = { 4: 0.3, 5: 0.45, 6: 0.6, 7: 0.66, 8: 0.72, 9: 0.78 };

export function decayOf(node) {
    if (!node) return 0;

    if (node.kind === "level") return DECAY[node.level] ?? 0;

    if (node.kind === "actComplete")
        return DECAY[levelsOfAct(node.act).at(-1)?.level] ?? 0;

    return 0;
}
