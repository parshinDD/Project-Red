import { useGameStore } from "@/store/gameStore";
import { useUiStore } from "@/store/uiStore";
import { getNode } from "./flow/nodes";
import { advance } from "./flow/navigator";
import { completeLevelEffects } from "./levelComplete";
import { grantJournal } from "./rewards";
import { REQUIRED_PLAYER_ID } from "./constants";
import { BUGS } from "@/scenes/act1/level01/bugs";

export const DEV_TOOLS =
    Boolean(import.meta.env?.DEV) ||
    (typeof location !== "undefined" &&
        new URLSearchParams(location.search).has("dev"));

const EXTRAS = {
    1: () => {
        useGameStore
            .getState()
            .setLevelProgress(1, { found: BUGS.map((b) => b.id) });
        grantJournal("level-1-report");
    },
    2: () => grantJournal("known-issue"),
    3: () => grantJournal("memory-correction"),
};

export function devSolve() {
    const game = useGameStore.getState();
    const ui = useUiStore.getState();
    const node = getNode(game.nodeId);

    if (ui.transition || ui.screenCut || game.phase === "LEVEL_FAILED") return;

    if (node.kind === "level" && game.phase === "LEVEL_ACTIVE") {
        EXTRAS[node.level]?.();
        completeLevelEffects(node.level);
        ui.pushMessage(`DEV: level ${node.level} solved`, "dim");

        return;
    }

    if (node.kind === "prologue" && node.id === "prologue.agreement")
        game.acceptAgreement(REQUIRED_PLAYER_ID);

    advance();
}
