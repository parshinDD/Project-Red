import { useEffect, useMemo } from "react";
import { useGameStore } from "@/store/gameStore";
import { getNode } from "@/game/flow/nodes";
import { advance } from "@/game/flow/navigator";
import { grantAchievement } from "@/game/rewards";
import CompletePanel from "@/ui/CompletePanel";

const COPY = {
    1: [
        "ACT I COMPLETE",
        "3/3 LEVELS CLEARED",
        "",
        "Build status: unstable.",
        "Player status: acceptable.",
    ],
    2: [
        "ACT II COMPLETE",
        "All survival tests passed.",
        "",
        "System integrity: questionable.",
    ],
    3: [
        "ACT III COMPLETE",
        "Memory records recovered: 3",
        "Developer identity: REDACTED",
    ],
};

export default function ActComplete() {
    const act = getNode(useGameStore((s) => s.nodeId)).act;
    const clean = useGameStore((s) => !(s.actHpLost[act] > 0));

    const lines = useMemo(() => {
        const base = (COPY[act] ?? [`ACT ${act} COMPLETE`]).map((text, i) => ({
            text,
            tone: i === 0 ? "title" : "fg",
        }));

        return clean
            ? [
                  ...base,
                  { text: "" },
                  { text: "Clean run: no HP lost.", tone: "dim" },
              ]
            : base;
    }, [act, clean]);

    useEffect(() => {
        const { clean: isClean } = useGameStore.getState().markActComplete(act);
        if (isClean) grantAchievement("clean-run");
    }, [act]);

    return (
        <CompletePanel title="ACT REPORT" lines={lines} onContinue={advance} />
    );
}
