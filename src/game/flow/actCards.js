import { BUILD_NAME } from "@/game/constants";

export const ACT_CARD = {
    1: {
        motif: "stamp",
        kicker: `${BUILD_NAME} · CHAPTER 1 / 4`,
        log: ["channel: closed beta", "testers: 1", "stability: unknown"],
    },

    2: {
        motif: "hazard",
        kicker: `${BUILD_NAME} · CHAPTER 2 / 4`,
        log: [
            "time limits: enabled",
            "mistakes: logged",
            "mercy: not implemented",
        ],
    },

    3: {
        motif: "runes",
        kicker: `${BUILD_NAME} · CHAPTER 3 / 4`,
        log: ["origin: not found", "world: loading", "permission: unclear"],
    },

    4: {
        motif: "signal",
        kicker: `${BUILD_NAME} · CHAPTER 4 / 4`,
        log: [
            "signal: unregistered",
            "source: unknown",
            "recovery: in progress",
        ],
    },
};

export const DEFAULT_ACT_CARD = {
    motif: "signal",
    kicker: BUILD_NAME,
    log: ["loading module"],
};
