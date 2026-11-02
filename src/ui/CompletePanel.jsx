import { useMemo, useState } from "react";
import { TerminalWindow, terminalStyles as t } from "./Terminal";
import TypedBlock from "./TypedBlock";
import Gem from "./gem/Gem";
import { GEMS } from "@/game/data/gems";
import TerminalButton from "./TerminalButton";
import { pad2 } from "@/game/flow/nodes";
import { TOTAL_SHARDS } from "@/game/constants";

export default function CompletePanel({
    title = "RESULT",
    lines,
    shard,
    onContinue,
    continueLabel = "CONTINUE",
}) {
    const [done, setDone] = useState(false);

    const items = useMemo(
        () =>
            lines.map((l) =>
                l.text === ""
                    ? { k: "gap", delay: l.delay }
                    : {
                          k: "text",
                          text: l.text,
                          tone: l.tone,
                          glitch: l.glitch,
                          delay: l.delay ?? 320,
                      },
            ),
        [lines],
    );

    return (
        <TerminalWindow title={title} aria-live="polite">
            <TypedBlock items={items} onDone={() => setDone(true)} />
            {done && shard != null && (
                <p className={t.reward}>
                    <Gem n={shard} size="2rem" glow={false} />
                    <span className="tnum">
                        Shard {pad2(shard)} / {TOTAL_SHARDS} ·{" "}
                        {GEMS[shard]?.name} recovered
                    </span>
                </p>
            )}
            {done && (
                <div className={t.actions}>
                    <TerminalButton
                        variant="primary"
                        onClick={onContinue}
                        autoFocus
                    >
                        {continueLabel}
                    </TerminalButton>
                </div>
            )}
        </TerminalWindow>
    );
}
