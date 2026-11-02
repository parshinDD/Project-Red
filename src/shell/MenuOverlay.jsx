import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useGameStore } from "@/store/gameStore";
import { useUiStore } from "@/store/uiStore";
import { useFocusTrap } from "@/game/hooks/useFocusTrap";
import { setMuted } from "@/audio/audioEngine";
import TerminalButton from "@/ui/TerminalButton";
import s from "./shell.module.css";

function Panel() {
    const ref = useRef(null);
    useFocusTrap(ref);

    const muted = useGameStore((st) => st.muted);
    const [confirm, setConfirm] = useState(false);
    const close = () => useUiStore.getState().setMenuOpen(false);

    const toggleSound = () => {
        useGameStore.getState().setMuted(!muted);
        setMuted(!muted);
    };

    const reset = () => {
        useGameStore.getState().resetAll();
        useUiStore.getState().clearMessages();
        useUiStore.getState().setMenuOpen(false);
    };

    return (
        <motion.div
            ref={ref}
            className={s.modal}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
            <h2 className={s.modalTitle}>Menu</h2>
            <div className={s.stack}>
                <TerminalButton variant="primary" onClick={close}>
                    Resume
                </TerminalButton>
                <TerminalButton onClick={toggleSound} aria-pressed={!muted}>
                    Sound: {muted ? "off" : "on"}
                </TerminalButton>
            </div>

            <div className={s.zone}>
                <p className={s.zoneLabel}>Danger zone</p>
                {!confirm ? (
                    <TerminalButton
                        variant="danger"
                        onClick={() => setConfirm(true)}
                    >
                        Start over...
                    </TerminalButton>
                ) : (
                    <>
                        <p className={s.note}>
                            This erases all local progress: levels, shards,
                            journal and achievements.
                        </p>
                        <TerminalButton variant="danger" onClick={reset}>
                            Yes, erase everything
                        </TerminalButton>
                        <TerminalButton onClick={() => setConfirm(false)}>
                            Cancel
                        </TerminalButton>
                    </>
                )}
            </div>
        </motion.div>
    );
}

export default function MenuOverlay() {
    const open = useUiStore((st) => st.menuOpen);
    return (
        <AnimatePresence>
            {open && [
                <motion.div
                    key="bd"
                    className={s.backdrop}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => useUiStore.getState().setMenuOpen(false)}
                />,
                <Panel key="panel" />,
            ]}
        </AnimatePresence>
    );
}
