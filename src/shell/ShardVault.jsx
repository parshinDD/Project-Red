import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useGameStore } from "@/store/gameStore";
import { useUiStore } from "@/store/uiStore";
import { useFocusTrap } from "@/game/hooks/useFocusTrap";
import { GEMS } from "@/game/data/gems";
import { pad2 } from "@/game/flow/nodes";
import { TOTAL_SHARDS } from "@/game/constants";
import { cx } from "@/lib/cx";
import TerminalButton from "@/ui/TerminalButton";
import VaultBox from "./VaultBox";
import shell from "./shell.module.css";
import v from "./vault.module.css";

function Panel() {
    const ref = useRef(null);
    useFocusTrap(ref);

    const shards = useGameStore((st) => st.shards);
    const pulse = useUiStore((st) => st.shardPulse);
    const drop = useUiStore((st) => st.shardDrop);

    const [sel, setSel] = useState(() =>
        shards.length ? shards[shards.length - 1] : null,
    );
    const close = () => useUiStore.getState().setVaultOpen(false);
    const has = (n) => shards.includes(n) && n !== drop;

    return (
        <motion.div
            ref={ref}
            className={v.panel}
            role="dialog"
            aria-modal="true"
            aria-label="Хранилище осколков"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 14 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
        >
            <div className={v.head}>
                <div>
                    <h2 className={v.title}>Модуль восстановления</h2>
                    <p className={v.count}>
                        {pad2(shards.filter((n) => n !== drop).length)}/
                        {TOTAL_SHARDS} восстановлено
                    </p>
                </div>
                <TerminalButton size="small" onClick={close}>
                    Закрыть [I]
                </TerminalButton>
            </div>

            <VaultBox
                shards={shards}
                hidden={drop}
                selected={sel}
                onSelect={setSel}
                pulse={pulse}
            />

            <div className={v.detail} aria-live="polite">
                {sel == null ? (
                    <p className={v.detailText}>
                        Выберите гнездо, чтобы осмотреть его.
                    </p>
                ) : has(sel) ? (
                    <>
                        <p className={cx(v.detailTitle, v.got)}>
                            Осколок {pad2(sel)} - {GEMS[sel].name}
                        </p>
                        <p className={v.detailText}>
                            Получен за прохождение уровня {pad2(sel)}.
                        </p>
                    </>
                ) : (
                    <>
                        <p className={v.detailTitle}>
                            Гнездо {pad2(sel)} - пусто
                        </p>
                        <p className={v.detailText}>
                            Пройдите уровень {pad2(sel)}, чтобы положить камень
                            сюда.
                        </p>
                    </>
                )}
            </div>
        </motion.div>
    );
}

export default function ShardVault() {
    const open = useUiStore((st) => st.vaultOpen);

    return (
        <AnimatePresence>
            {open && [
                <motion.div
                    key="bd"
                    className={shell.backdrop}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => useUiStore.getState().setVaultOpen(false)}
                />,
                <Panel key="panel" />,
            ]}
        </AnimatePresence>
    );
}
