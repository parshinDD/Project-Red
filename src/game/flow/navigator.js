import { useGameStore } from "@/store/gameStore";
import { useUiStore } from "@/store/uiStore";
import { getNode, getNextNodeId } from "./nodes";
import { consoleScript } from "./transitions";
import { TIMING } from "./timing";

const CUT_OUT_MS = 340;
const CUT_HOLD_MS = 500;
const CUT_IN_MS = 420;
let pendingCut = null;
let active = null;

function pickKind(from, to) {
    if (from?.surface === "crt" && to.surface === "crt") return "crt";

    if (to.kind === "level") return from?.act !== to.act ? "act" : "level";

    return "fade";
}

function cardFor(kind, from, to) {
    if (kind === "level")
        return {
            level: to.level,
            fromLevel: from?.level ?? 0,
            title: to.title,
            act: to.act,
        };

    if (kind === "act") return { act: to.act, level: to.level };

    return null;
}

function finish(run) {
    if (active !== run) return;

    active = null;
    useUiStore.getState().endTransition();
}

export function navigate(toId) {
    const ui = useUiStore.getState();
    const game = useGameStore.getState();
    const to = getNode(toId);

    if (!to || ui.transition) return;

    const kind = pickKind(getNode(game.nodeId), to);
    if (kind === "crt") {
        const from = getNode(game.nodeId);
        ui.beginTransition({ kind, card: null });
        ui.setScreenCut("out");

        pendingCut = { toId, to };
        setTimeout(() => {
            const u = useUiStore.getState();
            u.setCutLines(
                consoleScript(from, to, {
                    playerId: useGameStore.getState().playerId,
                }),
            );
            u.setScreenCut("run");
        }, CUT_OUT_MS);

        return;
    }

    const T = TIMING[kind];
    const run = { kind, swapped: false, endTimer: null };
    active = run;
    ui.beginTransition({ kind, card: cardFor(kind, getNode(game.nodeId), to) });

    setTimeout(() => {
        useUiStore.getState().clearMessages();
        useUiStore.getState().setMood(null);
        useGameStore.getState().setNode(toId);
        if (to.tip) useUiStore.getState().pushMessage(to.tip, "dim");

        run.swapped = true;
    }, T.cover);

    run.endTimer = setTimeout(() => finish(run), T.cover + T.hold);
}

export function skipTransition() {
    const run = active;
    if (!run || run.kind !== "act" || !run.swapped) return;

    clearTimeout(run.endTimer);
    finish(run);
}

export function advance() {
    const next = getNextNodeId(useGameStore.getState().nodeId);

    if (next) navigate(next);
}

export function finishCutRun() {
    const cut = pendingCut;
    if (!cut) return;

    pendingCut = null;
    setTimeout(() => {
        const u = useUiStore.getState();
        u.clearMessages();
        u.setMood(null);
        useGameStore.getState().setNode(cut.toId);
        if (cut.to.tip) u.pushMessage(cut.to.tip, "dim");
        u.setScreenCut("in");
        u.setCutLines(null);
    }, CUT_HOLD_MS);

    setTimeout(() => {
        const u = useUiStore.getState();
        u.setScreenCut(null);
        u.endTransition();
    }, CUT_HOLD_MS + CUT_IN_MS);
}
