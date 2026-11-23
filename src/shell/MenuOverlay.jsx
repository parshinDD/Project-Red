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
            aria-label="Меню"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
            <h2 className={s.modalTitle}>Меню</h2>
            <div className={s.stack}>
                <TerminalButton variant="primary" onClick={close}>
                    Продолжить
                </TerminalButton>
                <TerminalButton onClick={toggleSound} aria-pressed={!muted}>
                    Звук: {muted ? "выкл" : "вкл"}
                </TerminalButton>
            </div>

            <div className={s.zone}>
                <p className={s.zoneLabel}>Опасная зона</p>
                {!confirm ? (
                    <TerminalButton
                        variant="danger"
                        onClick={() => setConfirm(true)}
                    >
                        Начать заново...
                    </TerminalButton>
                ) : (
                    <>
                        <p className={s.note}>
                            Это сотрет весь локальный прогресс: уровни, осколки,
                            журнал и достижения.
                        </p>
                        <TerminalButton variant="danger" onClick={reset}>
                            Да, стереть все
                        </TerminalButton>
                        <TerminalButton onClick={() => setConfirm(false)}>
                            Отмена
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
