import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useGameStore } from "@/store/gameStore";
import { useUiStore } from "@/store/uiStore";
import { useFocusTrap } from "@/game/hooks/useFocusTrap";
import { JOURNAL } from "@/game/data/journal";
import { ACHIEVEMENTS } from "@/game/data/achievements";
import TerminalButton from "@/ui/TerminalButton";
import AchievementIcon from "@/ui/AchievementIcon";
import s from "./shell.module.css";

function Panel() {
    const ref = useRef(null);

    useFocusTrap(ref);
    const [tab, setTab] = useState("archive");

    const journal = useGameStore((st) => st.journal);
    const earned = useGameStore((st) => st.achievements);
    const close = () => useUiStore.getState().setJournalOpen(false);

    return (
        <motion.aside
            ref={ref}
            className={s.drawer}
            role="dialog"
            aria-modal="true"
            aria-label="Journal"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
            <div className={s.drawerHead}>
                <h2 className={s.drawerTitle}>Journal</h2>
                <TerminalButton size="small" onClick={close}>
                    Close [J]
                </TerminalButton>
            </div>
            <div className={s.tabs} role="tablist">
                {[
                    ["archive", "Archive"],
                    ["achievements", "Achievements"],
                ].map(([id, name]) => (
                    <button
                        key={id}
                        type="button"
                        role="tab"
                        className={s.tab}
                        aria-selected={tab === id}
                        onClick={() => setTab(id)}
                    >
                        {name}
                    </button>
                ))}
            </div>
            <div className={s.drawerBody} role="tabpanel">
                {tab === "archive" &&
                    (journal.length === 0 ? (
                        <p className={s.empty}>No records recovered yet.</p>
                    ) : (
                        journal.map(
                            (id) =>
                                JOURNAL[id] && (
                                    <article key={id} className={s.entry}>
                                        <h3>{JOURNAL[id].title}</h3>
                                        <p>{JOURNAL[id].body}</p>
                                    </article>
                                ),
                        )
                    ))}
                {tab === "achievements" && (
                    <>
                        <p className={s.achSummary}>
                            <span className="tnum">
                                {earned.length}/
                                {Object.keys(ACHIEVEMENTS).length}
                            </span>{" "}
                            unlocked
                        </p>
                        {Object.entries(ACHIEVEMENTS).map(([id, a]) => {
                            const has = earned.includes(id);
                            return (
                                <article
                                    key={id}
                                    className={`${s.ach} ${has ? s.achOn : s.achOff}`}
                                >
                                    <AchievementIcon earned={has} />
                                    {has ? (
                                        <div className={s.achText}>
                                            <h3>{a.name}</h3>
                                            <p>{a.desc}</p>
                                            <span className={s.achTag}>
                                                Unlocked
                                            </span>
                                        </div>
                                    ) : (
                                        <div className={s.achText}>
                                            <h3>Locked</h3>
                                            <p
                                                className={s.redact}
                                                aria-label="Hidden until unlocked"
                                            >
                                                <i />
                                                <i />
                                            </p>
                                            <span className={s.achTag}>
                                                Not yet unlocked
                                            </span>
                                        </div>
                                    )}
                                </article>
                            );
                        })}
                    </>
                )}
            </div>
        </motion.aside>
    );
}

export default function JournalDrawer() {
    const open = useUiStore((st) => st.journalOpen);

    return (
        <AnimatePresence>
            {open && [
                <motion.div
                    key="bd"
                    className={s.backdrop}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => useUiStore.getState().setJournalOpen(false)}
                />,
                <Panel key="panel" />,
            ]}
        </AnimatePresence>
    );
}
