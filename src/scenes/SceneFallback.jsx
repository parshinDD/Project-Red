import { useGameStore } from "@/store/gameStore";
import { getNode, nodeLabel } from "@/game/flow/nodes";
import { TerminalWindow, TermLine } from "@/ui/Terminal";
import TypedBlock from "@/ui/TypedBlock";

export function SceneLoading() {
    return (
        <TerminalWindow title="Загрузка">
            <TermLine text="Загрузка модуля…" tone="dim" silent instant />
        </TerminalWindow>
    );
}

export default function ComingSoon() {
    const node = getNode(useGameStore((s) => s.nodeId));

    const items = [
        { k: "text", text: "СБОРКА ЕЩЕ НЕ РАЗВЕРНУТА", tone: "err", delay: 300 },
        { k: "gap", delay: 100 },
        { k: "text", text: `Запрошено: ${nodeLabel(node)}`, tone: "dim" },
        { k: "text", text: "Этот модуль не входит в текущую сборку." },
    ];

    return (
        <TerminalWindow title="Модуль не найден">
            <TypedBlock items={items} />
        </TerminalWindow>
    );
}
