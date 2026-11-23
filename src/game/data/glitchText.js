const COMMON = {
    build: [["BUILD_02-12", "BUILD_??-??"]],
    hp: [["HP", "??"]],
    hint: [["Подсказка", "Нет"]],
    menu: [["Меню", "Остаться"]],
    journal: [["Журнал", "Записи"]],
    objective: [["Задача", "Директива"]],
    where: [
        ["УРОВЕНЬ", "ОШИБКА"],
        ["АКТ", "???"],
    ],
};

const WHERE_BY_LEVEL = {
    4: [["ЗЕЛЕНЫЙ СВЕТ", "КРАСНЫЙ СВЕТ"]],
    5: [["МОСТ", "БЕЗДНА"]],
    6: [["ГОЛОСОВАНИЕ", "ЛЖЕЦЫ"]],
    7: [["СОЗДАНИЕ", "УДАЛЕНИЕ"]],
    8: [["ФАМИЛЬЯРЫ", "РОДСТВЕННИКИ"]],
    9: [["ТАВЕРНА", "СЕРВЕР"]],
    10: [["ШИФР", "ТИШИНА"]],
    11: [["ПРОТОКОЛ", "БОЕЗАРЯД"]],
    12: [["СИГНАЛ", "ПОМЕХИ"]],
};

const SKIN = {
    3: {
        build: [["BUILD", "REALM"]],
        where: [["УРОВЕНЬ", "КВЕСТ"]],
        hint: [["Подсказка", "Руна"]],
        menu: [["Меню", "Лагерь"]],
        journal: [["Журнал", "Свитки"]],
        objective: [["Задача", "Квест"]],
    },
};

export const skinOf = (act, key) => SKIN[act]?.[key] ?? [];
const WHERE_COMPLETE = [["ПРОЙДЕН", "НЕСТАБИЛЕН"]];

export function swapsFor(key, node) {
    const base = COMMON[key] ?? [];
    if (key !== "where" || !node) return base;

    if (node.kind === "actComplete") return [...base, ...WHERE_COMPLETE];

    return [...base, ...(WHERE_BY_LEVEL[node.level] ?? [])];
}
