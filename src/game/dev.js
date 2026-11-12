import { useGameStore } from "@/store/gameStore";
import { useUiStore } from "@/store/uiStore";
import { getNode, NODES } from "./flow/nodes";
import { advance, navigate } from "./flow/navigator";
import { completeLevelEffects } from "./levelComplete";
import { grantJournal } from "./rewards";
import { REQUIRED_PLAYER_ID, START_HP } from "./constants";
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
    4: () => grantJournal("signal-origin"),
    5: () => {},
    6: () => grantJournal("system-statement"),
    7: () => grantJournal("character-origin"),
    8: () => grantJournal("things-worth-remembering"),
    9: () => grantJournal("developer-identity"),
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

const uniq = (arr, items) => [...arr, ...items.filter((v) => !arr.includes(v))];

export function devJump(
    toId,
    { completeBefore = true, restoreHp = true, instant = false } = {},
) {
    const ui = useUiStore.getState();
    const to = getNode(toId);

    if (!to || ui.transition || ui.screenCut) return false;

    const before = NODES.slice(0, to.index);
    const patch = {};

    if (completeBefore) {
        const levels = before
            .filter((n) => n.kind === "level")
            .map((n) => n.level);

        const acts = [
            ...new Set(
                before
                    .filter((n) => n.kind === "actComplete")
                    .map((n) => n.act),
            ),
        ];

        patch.completedLevels = uniq(
            useGameStore.getState().completedLevels,
            levels,
        );

        patch.shards = uniq(useGameStore.getState().shards, levels);
        patch.completedActs = uniq(useGameStore.getState().completedActs, acts);

        if (to.index > 0 && !useGameStore.getState().playerId)
            patch.playerId = REQUIRED_PLAYER_ID;
    }

    if (restoreHp) patch.hp = START_HP;

    useGameStore.setState(patch);

    ui.setJournalOpen(false);
    ui.setMenuOpen(false);
    ui.setVaultOpen(false);

    if (instant) {
        useGameStore.getState().setNode(toId);
        ui.clearMessages();

        if (to.tip) ui.pushMessage(to.tip, "dim");
    } else {
        if (useGameStore.getState().phase === "LEVEL_FAILED")
            useGameStore.setState({ phase: "LEVEL_ACTIVE" });

        navigate(toId);
    }

    return true;
}
