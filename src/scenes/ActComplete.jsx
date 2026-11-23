import { useEffect, useMemo } from "react";
import { useGameStore } from "@/store/gameStore";
import { getNode } from "@/game/flow/nodes";
import { advance } from "@/game/flow/navigator";
import { grantAchievement } from "@/game/rewards";
import CompletePanel from "@/ui/CompletePanel";

const COPY = {
    1: [
        "АКТ I ПРОЙДЕН",
        "Уровней пройдено: 3/3",
        "",
        "Статус сборки: нестабильный.",
        "Статус игрока: приемлемый.",
    ],
    2: [
        "АКТ II ПРОЙДЕН",
        "Все тесты на выживание пройдены.",
        "",
        "Целостность системы: сомнительная.",
    ],
    3: [
        "АКТ III ПРОЙДЕН",
        "Записей памяти восстановлено: 3",
        "Личность разработчика: СКРЫТА",
    ],
};

export default function ActComplete() {
    const act = getNode(useGameStore((s) => s.nodeId)).act;
    const clean = useGameStore((s) => !(s.actHpLost[act] > 0));

    const lines = useMemo(() => {
        const base = (COPY[act] ?? [`АКТ ${act} ПРОЙДЕН`]).map((text, i) => ({
            text,
            tone: i === 0 ? "title" : "fg",
        }));

        return clean
            ? [
                  ...base,
                  { text: "" },
                  { text: "Чистое прохождение: HP не потеряны.", tone: "dim" },
              ]
            : base;
    }, [act, clean]);

    useEffect(() => {
        const { clean: isClean } = useGameStore.getState().markActComplete(act);
        if (isClean) grantAchievement("clean-run");
    }, [act]);

    return (
        <CompletePanel title="ОТЧЕТ ПО АКТУ" lines={lines} onContinue={advance} />
    );
}
