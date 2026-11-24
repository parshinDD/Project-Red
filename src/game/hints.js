import { useGameStore } from "@/store/gameStore";
import { useUiStore } from "@/store/uiStore";
import { getNode } from "./flow/nodes";
import { HINTS } from "./data/hints";
import { play } from "@/audio/audioEngine";

const fmtLeft = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);

    return m > 0 ? `${m}м ${String(s).padStart(2, "0")}с` : `${s}с`;
};

export function requestHint() {
    const game = useGameStore.getState();
    const node = getNode(game.nodeId);

    if (node?.kind !== "level" || game.phase !== "LEVEL_ACTIVE") return;

    const source = HINTS[node.level];
    if (!source) return;

    const hint = game.hintAt(node.level);

    if (!hint.ready) {
        useUiStore
            .getState()
            .pushMessage(
                hint.next == null
                    ? "ПОДСКАЗКИ: все подсказки уже открыты."
                    : `ПОДСКАЗКА ${hint.used + 1} откроется через ${fmtLeft(hint.left)}.`,
                "dim",
            );
        play("error");

        return;
    }

    const step = hint.used;
    const text = Array.isArray(source)
        ? source[Math.min(step, source.length - 1)]
        : source(game.levelProgress[node.level], step);
    const n = game.bumpHint(node.level);

    play("blip");
    useUiStore.getState().pushMessage(`ПОДСКАЗКА ${n}: ${text}`, "hint");
}

export const levelHasHints = (node) =>
    node?.kind === "level" && Boolean(HINTS[node.level]);

export function tickLevelSeconds(level, seconds) {
    useGameStore.getState().tickLevel(level, seconds);
}
