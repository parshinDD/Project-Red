import { useGameStore } from "@/store/gameStore";
import { useUiStore } from "@/store/uiStore";
import { requestHint, levelHasHints } from "@/game/hints";
import TerminalButton from "@/ui/TerminalButton";
import { swapsFor } from "@/game/data/glitchText";
import Glitchable from "@/ui/Glitchable";
import s from "./shell.module.css";

export default function HintBar({ node }) {
    const messages = useUiStore((st) => st.messages);
    const setMenuOpen = useUiStore((st) => st.setMenuOpen);
    const phase = useGameStore((st) => st.phase);
    const used = useGameStore((st) => st.hintsUsed[node.level] ?? 0);
    const canHint = levelHasHints(node) && phase === "LEVEL_ACTIVE";

    return (
        <footer className={s.dock}>
            <div className={`${s.inner} ${s.dockInner}`}>
                <TerminalButton
                    size="small"
                    onClick={requestHint}
                    disabled={!canHint}
                    sound={null}
                    aria-keyshortcuts="H"
                >
                    <Glitchable swaps={swapsFor("hint")}>Hint</Glitchable> [H]
                    {used > 0 ? ` · ${used}` : ""}
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
                    <Glitchable swaps={swapsFor("menu")}>Menu</Glitchable> [Esc]
                </TerminalButton>
            </div>
        </footer>
    );
}
