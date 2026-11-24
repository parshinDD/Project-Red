import { useEffect, useState } from "react";
import { useGameStore } from "@/store/gameStore";
import { useUiStore } from "@/store/uiStore";
import { requestHint, levelHasHints } from "@/game/hints";
import { HINTS } from "@/game/data/hints";
import TerminalButton from "@/ui/TerminalButton";
import { swapsFor } from "@/game/data/glitchText";
import Glitchable from "@/ui/Glitchable";
import s from "./shell.module.css";

const HINT_DELAYS = [60, 180, 600];

const fmtLeft = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);

    return m > 0 ? `${m}м ${String(s).padStart(2, "0")}с` : `${s}с`;
};

export default function HintBar({ node }) {
    const messages = useUiStore((st) => st.messages);
    const setMenuOpen = useUiStore((st) => st.setMenuOpen);

    const phase = useGameStore((st) => st.phase);
    const used = useGameStore((st) => st.hintsUsed[node.level] ?? 0);
    const spent = useGameStore((st) => st.levelSeconds[node.level] ?? 0);
    const attempt = useGameStore((st) => st.attempt);
    const completedNow = useGameStore((st) =>
        st.completedLevels.includes(node.level),
    );

    const isLevel = node.kind === "level";
    const hasHints = levelHasHints(node);
    const canHint = hasHints && phase === "LEVEL_ACTIVE" && !completedNow;
    const hintTotal = Array.isArray(HINTS[node.level])
        ? HINTS[node.level].length
        : HINTS[node.level]
          ? 3
          : 0;
    const nextAt = HINT_DELAYS[used];
    const allOpen =
        used >= HINT_DELAYS.length ||
        (hintTotal > 0 && used >= Math.min(hintTotal, HINT_DELAYS.length));
    const ready = canHint && !allOpen && spent >= nextAt;
    const left = Math.max(0, (nextAt ?? 0) - spent);

    const [, setNow] = useState(0);

    useEffect(() => {
        if (!isLevel || completedNow) return;

        const t0 = performance.now();
        const id = setInterval(() => {
            const seconds = (performance.now() - t0) / 1000;

            setNow(seconds);
            useGameStore.getState().tickLevel(node.level, seconds);
        }, 1000);

        return () => clearInterval(id);
    }, [isLevel, node.level, attempt, completedNow]);

    return (
        <footer className={s.dock}>
            <div className={`${s.inner} ${s.dockInner}`}>
                <TerminalButton
                    size="small"
                    onClick={requestHint}
                    disabled={!canHint || allOpen}
                    sound={null}
                    aria-keyshortcuts="H"
                    title={
                        canHint && !allOpen
                            ? ready
                                ? "Открыть следующую подсказку"
                                : `Откроется через ${fmtLeft(left)}`
                            : undefined
                    }
                >
                    <Glitchable swaps={swapsFor("hint")} skinKey="hint">
                        Подсказка
                    </Glitchable>{" "}
                    [H]
                    {!allOpen && used > 0 ? ` · ${used}` : ""}
                    {canHint && !allOpen && !ready ? ` · ${fmtLeft(left)}` : ""}
                    {allOpen ? (used > 0 ? " · все" : "") : ""}
                </TerminalButton>
                <div className={s.log} role="log" aria-live="polite">
                    {messages.map((m) => (
                        <p key={m.id} className={s[`msg${m.tone}`] ?? s.msgfg}>
                            {m.text}
                        </p>
                    ))}
                </div>
                <TerminalButton
                    size="small"
                    onClick={() => setMenuOpen(true)}
                    aria-keyshortcuts="Escape"
                >
                    <Glitchable swaps={swapsFor("menu")} skinKey="menu">
                        Меню
                    </Glitchable>{" "}
                    [Esc]
                </TerminalButton>
            </div>
        </footer>
    );
}
