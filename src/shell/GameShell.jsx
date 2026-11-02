import { Suspense, useEffect } from "react";
import { setAmbience, detachLamp, STAGE_AMBIENCE } from "@/audio/audioEngine";
import { motion } from "motion/react";
import { useGameStore } from "@/store/gameStore";
import { useUiStore } from "@/store/uiStore";
import { getNode } from "@/game/flow/nodes";
import { getScene } from "@/game/flow/sceneRegistry";
import { useHotkeys } from "@/game/hooks/useHotkeys";
import { useDevKeys } from "@/game/hooks/useDevKeys";
import ShardDrop from "./ShardDrop";
import { requestHint } from "@/game/hints";
import ComingSoon, { SceneLoading } from "@/scenes/SceneFallback";
import TopBar from "./TopBar";
import HintBar from "./HintBar";
import JournalDrawer from "./JournalDrawer";
import MenuOverlay from "./MenuOverlay";
import GameOverOverlay from "./GameOverOverlay";
import ToastStack from "./ToastStack";
import TransitionLayer from "./TransitionLayer";
import ShardVault from "./ShardVault";
import TransitionConsole from "@/scenes/TransitionConsole";
import CrtRoom from "@/crt/CrtRoom";
import s from "./shell.module.css";

export default function GameShell() {
    const nodeId = useGameStore((st) => st.nodeId);
    const attempt = useGameStore((st) => st.attempt);
    const phase = useGameStore((st) => st.phase);

    const overlayOpen = useUiStore(
        (st) => st.journalOpen || st.menuOpen || st.vaultOpen,
    );
    const moodOverride = useUiStore((st) => st.mood);
    const cut = useUiStore((st) => st.screenCut);
    const typing = useUiStore((st) => st.typing > 0);
    const ledFlash = useUiStore((st) => st.ledFlash?.mode ?? null);

    const node = getNode(nodeId);
    const Scene = getScene(nodeId) ?? ComingSoon;

    const crt = node.surface === "crt";
    const blocked = overlayOpen || phase === "LEVEL_FAILED";

    const sceneEl = (
        <motion.div
            key={`${nodeId}:${attempt}:${cut === "run" ? "run" : ""}`}
            className={crt ? s.sceneCrt : s.scene}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
        >
            <Suspense fallback={<SceneLoading />}>
                {cut === "run" ? <TransitionConsole /> : <Scene />}
            </Suspense>
        </motion.div>
    );

    useEffect(() => {
        if (!crt) {
            detachLamp();
            setAmbience(STAGE_AMBIENCE, 0.8);
        }
    }, [crt]);

    useDevKeys();
    useHotkeys({
        j: () => {
            if (useGameStore.getState().phase === "INTRO") return;

            useUiStore.getState().toggleJournal();
        },
        i: () => {
            if (useGameStore.getState().phase === "INTRO") return;

            useUiStore.getState().toggleVault();
        },
        h: () => requestHint(),
        Escape: () => {
            const ui = useUiStore.getState();
            if (useGameStore.getState().phase === "LEVEL_FAILED") return;

            if (ui.journalOpen) ui.setJournalOpen(false);
            else if (ui.vaultOpen) ui.setVaultOpen(false);
            else ui.setMenuOpen(!ui.menuOpen);
        },
    });

    return (
        <div className={s.shell} data-theme={node.theme} data-phase={phase}>
            <TopBar node={node} />

            <div className={s.stageWrap}>
                {crt ? (
                    <CrtRoom
                        mood={moodOverride ?? node.mood ?? "boot"}
                        cut={cut}
                        led={ledFlash ?? (typing ? "busy" : null)}
                        inert={blocked}
                    >
                        {sceneEl}
                    </CrtRoom>
                ) : (
                    <>
                        <main className={s.stage} id="stage" inert={blocked}>
                            {sceneEl}
                        </main>
                        <div className={s.fx} aria-hidden="true" />
                    </>
                )}
            </div>

            <HintBar node={node} />
            <JournalDrawer />
            <ShardVault />
            <MenuOverlay />
            <GameOverOverlay />
            <ShardDrop />
            <ToastStack />
            <TransitionLayer />
        </div>
    );
}
