import { BUILD_NAME } from "@/game/constants";

export const ACT_CARD = {
    1: {
        motif: "stamp",
        kicker: `${BUILD_NAME} · ГЛАВА 1 / 4`,
        log: ["канал: закрытая бета", "тестеры: 1", "стабильность: неизвестна"],
    },

    2: {
        motif: "hazard",
        kicker: `${BUILD_NAME} · ГЛАВА 2 / 4`,
        log: [
            "лимиты времени: включены",
            "ошибки: записываются",
            "жалость: не реализована",
        ],
    },

    3: {
        motif: "runes",
        kicker: `${BUILD_NAME} · ГЛАВА 3 / 4`,
        log: [
            "происхождение: не найдено",
            "мир: загружается",
            "разрешение: неясно",
        ],
    },

    4: {
        motif: "signal",
        kicker: `${BUILD_NAME} · ГЛАВА 4 / 4`,
        log: [
            "сигнал: не зарегистрирован",
            "источник: неизвестен",
            "восстановление: идет",
        ],
    },
};

export const DEFAULT_ACT_CARD = {
    motif: "signal",
    kicker: BUILD_NAME,
    log: ["загрузка модуля"],
};
