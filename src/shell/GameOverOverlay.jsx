import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useGameStore } from "@/store/gameStore";
import { useFocusTrap } from "@/game/hooks/useFocusTrap";
import { GAME_OVER_SECONDS, START_HP } from "@/game/constants";
import { getNode, pad2 } from "@/game/flow/nodes";
import { play } from "@/audio/audioEngine";
import TerminalButton from "@/ui/TerminalButton";
import s from "./shell.module.css";

function Panel() {
    const ref = useRef(null);
    useFocusTrap(ref);

    const nodeId = useGameStore((st) => st.nodeId);

    const [left, setLeft] = useState(GAME_OVER_SECONDS);
    const level = getNode(nodeId)?.level;

    const respawn = () => useGameStore.getState().respawn();

    useEffect(() => {
        play("error");
    }, []);

    useEffect(() => {
        if (left <= 0) {
            respawn();
            return;
        }
        const id = setTimeout(() => setLeft((n) => n - 1), 1000);
        return () => clearTimeout(id);
    }, [left]);

    return (
        <motion.div
            ref={ref}
            className={s.gameover}
            role="alertdialog"
            aria-modal="true"
            aria-label="Game over"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
        >
            <h2 className={s.gameoverTitle}>GAME OVER</h2>
            <p className="tnum">
                HP: 0/{START_HP} · Recovery point: level {pad2(level ?? 0)}
            </p>
            <p className={s.note}>
                Completed levels, journal and shards are preserved. Only the
                current level is repeated.
            </p>
            <p className={s.countdown}>
                Respawn in <span className="tnum">{left}</span> s
            </p>
            <TerminalButton variant="primary" onClick={respawn}>
                Respawn now
            </TerminalButton>
        </motion.div>
    );
}

export default function GameOverOverlay() {
    const failed = useGameStore((st) => st.phase === "LEVEL_FAILED");
    return <AnimatePresence>{failed && <Panel key="go" />}</AnimatePresence>;
}
