import { useGameStore } from "@/store/gameStore";
import { useUiStore } from "@/store/uiStore";
import { play } from "@/audio/audioEngine";
import { pad2 } from "./flow/nodes";
import { GEMS } from "./data/gems";

export function completeLevelEffects(level) {
    const game = useGameStore.getState();
    if (game.completedLevels.includes(level)) return false;

    game.completeLevel(level);

    const ui = useUiStore.getState();
    ui.startShardDrop(level);

    play("shard");
    ui.pushMessage(
        `SHARD ${pad2(level)} RECOVERED — ${GEMS[level]?.name ?? ""}`.trim(),
        "hint",
    );

    return true;
}
