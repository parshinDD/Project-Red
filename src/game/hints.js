import { useGameStore } from "@/store/gameStore";
import { useUiStore } from "@/store/uiStore";
import { getNode } from "./flow/nodes";
import { HINTS } from "./data/hints";
import { play } from "@/audio/audioEngine";

export function requestHint() {
    const game = useGameStore.getState();
    const node = getNode(game.nodeId);

    if (node?.kind !== "level" || game.phase !== "LEVEL_ACTIVE") return;

    const source = HINTS[node.level];
    if (!source) return;

    const step = game.hintsUsed[node.level] ?? 0;
    const text = Array.isArray(source)
        ? source[Math.min(step, source.length - 1)]
        : source(game.levelProgress[node.level], step);
    const n = game.bumpHint(node.level);

    play("blip");
    useUiStore.getState().pushMessage(`HINT ${n}: ${text}`, "hint");
}

export const levelHasHints = (node) =>
    node?.kind === "level" && Boolean(HINTS[node.level]);
