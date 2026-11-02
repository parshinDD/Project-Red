import { useGameStore } from "@/store/gameStore";
import { getNode, nodeLabel } from "@/game/flow/nodes";
import { TerminalWindow, TermLine } from "@/ui/Terminal";
import TypedBlock from "@/ui/TypedBlock";

export function SceneLoading() {
    return (
        <TerminalWindow title="Loading">
            <TermLine text="Loading module…" tone="dim" silent instant />
        </TerminalWindow>
    );
}

export default function ComingSoon() {
    const node = getNode(useGameStore((s) => s.nodeId));

    const items = [
        { k: "text", text: "BUILD NOT YET DEPLOYED", tone: "err", delay: 300 },
        { k: "gap", delay: 100 },
        { k: "text", text: `Requested: ${nodeLabel(node)}`, tone: "dim" },
        { k: "text", text: "This module is not part of the current build." },
    ];

    return (
        <TerminalWindow title="Module not found">
            <TypedBlock items={items} />
        </TerminalWindow>
    );
}
