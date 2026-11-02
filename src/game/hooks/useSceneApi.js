import { useCallback } from "react";
import { useGameStore } from "@/store/gameStore";
import { useUiStore } from "@/store/uiStore";
import { advance } from "@/game/flow/navigator";
import { completeLevelEffects } from "@/game/levelComplete";
import { play } from "@/audio/audioEngine";

export function useSceneApi(level) {
    const phase = useGameStore((s) => s.phase);
    const completed = useGameStore((s) => s.completedLevels.includes(level));
    const progress = useGameStore((s) => s.levelProgress[level]);

    const setProgress = useCallback(
        (patch) => useGameStore.getState().setLevelProgress(level, patch),
        [level],
    );

    const complete = useCallback(() => completeLevelEffects(level), [level]);

    const damage = useCallback(() => {
        const hp = useGameStore.getState().damage();

        useUiStore.getState().bumpHpHit();
        useUiStore.getState().flashLed("error", 1000);
        useUiStore
            .getState()
            .pushMessage(
                hp > 0 ? `-1 HP — ${hp} remaining` : "HP DEPLETED",
                "err",
            );
        play("hit");

        return hp;
    }, []);

    const say = useCallback(
        (text, tone) => useUiStore.getState().pushMessage(text, tone),
        [],
    );

    return {
        phase,
        completed,
        active: phase === "LEVEL_ACTIVE" && !completed,
        progress,
        setProgress,
        complete,
        damage,
        say,
        next: advance,
    };
}
