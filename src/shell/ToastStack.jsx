import { AnimatePresence, motion } from "motion/react";
import { useUiStore } from "@/store/uiStore";
import AchievementIcon from "@/ui/AchievementIcon";
import s from "./shell.module.css";

export default function ToastStack() {
    const toasts = useUiStore((st) => st.toasts);

    return (
        <div className={s.toasts} role="status" aria-live="polite">
            <AnimatePresence>
                {toasts.map((t) =>
                    t.kind === "achievement" ? (
                        <motion.div
                            key={t.id}
                            className={`${s.toast} ${s.toastAch}`}
                            initial={{ opacity: 0, x: 120, scale: 0.96 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 120 }}
                            transition={{
                                duration: 0.45,
                                ease: [0.16, 1, 0.3, 1],
                            }}
                        >
                            <AchievementIcon size="3rem" />
                            <div className={s.toastText}>
                                <span className={s.toastTitle}>{t.title}</span>
                                <strong className={s.toastName}>
                                    {t.body}
                                </strong>
                                {t.desc && (
                                    <span className={s.toastDesc}>
                                        {t.desc}
                                    </span>
                                )}
                            </div>
                            <i className={s.shine} aria-hidden="true" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key={t.id}
                            className={s.toast}
                            initial={{ opacity: 0, x: 60 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 60 }}
                            transition={{
                                duration: 0.3,
                                ease: [0.16, 1, 0.3, 1],
                            }}
                        >
                            <span className={s.toastTitle}>{t.title}</span>
                            <span>{t.body}</span>
                        </motion.div>
                    ),
                )}
            </AnimatePresence>
        </div>
    );
}
