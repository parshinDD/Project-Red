import { useGameStore } from "@/store/gameStore";
import { useUiStore } from "@/store/uiStore";
import { ACHIEVEMENTS } from "./data/achievements";
import { JOURNAL } from "./data/journal";
import { play } from "@/audio/audioEngine";

export function grantAchievement(id) {
    const a = ACHIEVEMENTS[id];
    if (!a || !useGameStore.getState().addAchievement(id)) return false;

    useUiStore.getState().pushToast({
        kind: "achievement",
        title: "Achievement unlocked",
        body: a.name,
        desc: a.desc,
    });

    useUiStore.getState().flashLed("ok", 1000);
    play("achieve");

    return true;
}

export function grantJournal(id) {
    const e = JOURNAL[id];
    if (!e || !useGameStore.getState().addJournal(id)) return false;

    useUiStore.getState().pushToast({
        kind: "journal",
        title: "Journal updated",
        body: e.title,
    });

    return true;
}
