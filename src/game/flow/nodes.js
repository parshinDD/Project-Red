export const ACTS = {
    0: { roman: "", name: "ПРОЛОГ" },
    1: { roman: "I", name: "ЗАКРЫТАЯ БЕТА" },
    2: { roman: "II", name: "ВЫЖИВАНИЕ" },
    3: { roman: "III", name: "ИСЕКАЙ" },
    4: { roman: "IV", name: "РАЗВЕДКОРПУС" },
    5: { roman: "", name: "ФИНАЛ" },
};

const level = (n, act, theme, title, tip) => ({
    id: `level.${n}`,
    kind: "level",
    level: n,
    act,
    theme,
    title,
    tip,
});

export const NODES = [
    {
        id: "prologue.boot",
        kind: "prologue",
        act: 0,
        theme: "crt",
        surface: "crt",
        mood: "dark",
        title: "ЗАГРУЗКА",
    },
    {
        id: "prologue.agreement",
        kind: "prologue",
        act: 0,
        theme: "crt",
        surface: "crt",
        mood: "contract",
        title: "СОГЛАШЕНИЕ",
    },
    {
        id: "prologue.welcome",
        kind: "prologue",
        act: 0,
        theme: "crt",
        surface: "crt",
        mood: "online",
        title: "ПРИВЕТСТВИЕ",
    },

    level(
        1,
        1,
        "pixel",
        "ОХОТА НА БАГИ",
        "Нажимайте на все, что выглядит неправильно. Подсказки бесплатны.",
    ),
    level(
        2,
        1,
        "log",
        "ПАТЧНОУТЫ",
        "Читайте записи внимательно. Неверные ответы ничего не стоят.",
    ),
    level(
        3,
        1,
        "minimal",
        "ПАМЯТЬ",
        "Каждая ошибка стоит 1 HP. После ошибки последовательность повторяется.",
    ),
    {
        id: "act.1.complete",
        kind: "actComplete",
        act: 1,
        theme: "minimal",
        title: "АКТ ПРОЙДЕН",
    },

    level(
        4,
        2,
        "industrial",
        "КРАСНЫЙ СВЕТ, ЗЕЛЕНЫЙ СВЕТ",
        "Держите ПРОБЕЛ, чтобы двигаться. Отпускайте на красном: движение на красном стоит 1 HP.",
    ),
    level(
        5,
        2,
        "arena",
        "СТЕКЛЯННЫЙ МОСТ",
        "Прочитайте правила. Ошибочный переход стоит 1 HP. Подсказки бесплатны.",
    ),
    level(
        6,
        2,
        "dossier",
        "ГОЛОСОВАНИЕ ЛЖЕЦОВ",
        "Ошибочные отчеты ничего не стоят. Подсказки бесплатны.",
    ),
    {
        id: "act.2.complete",
        kind: "actComplete",
        act: 2,
        theme: "arena",
        title: "АКТ ПРОЙДЕН",
    },

    level(
        7,
        3,
        "fantasy",
        "СОЗДАНИЕ ПЕРСОНАЖА",
        "Свиток добавлен в ваш журнал [J]. Ошибочные сборки ничего не стоят.",
    ),
    level(
        8,
        3,
        "fantasy",
        "ФАМИЛЬЯРЫ",
        "Неверные ответы ничего не стоят. Подсказки бесплатны.",
    ),
    level(
        9,
        3,
        "tavern",
        "ТАВЕРНА",
        "Посещайте их в любом порядке. Неверные ответы ничего не стоят.",
    ),
    {
        id: "act.3.complete",
        kind: "actComplete",
        act: 3,
        theme: "tavern",
        title: "АКТ ПРОЙДЕН",
    },

    level(
        10,
        4,
        "military",
        "ШИФР РАЗВЕДЧИКА",
        "Неверные ответы ничего не стоят. Подсказки бесплатны.",
    ),
    level(
        11,
        4,
        "tactical",
        "ПРОТОКОЛ ТИТАНОВ",
        "HP на этом уровне не списывается. Подсказки бесплатны.",
    ),
    level(
        12,
        4,
        "signal",
        "СИГНАЛ RED MAGIC",
        "Сигнал можно прослушать повторно. Подсказки бесплатны.",
    ),

    {
        id: "final.assembly",
        kind: "final",
        act: 5,
        theme: "crt",
        surface: "crt",
        mood: "alarm",
        title: "СБОРКА",
        tip: "Двенадцать фрагментов. Двенадцать позиций. Один ключ.",
    },
    {
        id: "final.verify",
        kind: "final",
        act: 5,
        theme: "crt",
        surface: "crt",
        mood: "online",
        title: "ПРОВЕРКА АРХИВА",
    },
    {
        id: "final.report",
        kind: "final",
        act: 5,
        theme: "crt",
        surface: "crt",
        mood: "final",
        title: "ФИНАЛЬНЫЙ ОТЧЕТ",
    },
];

export const LEVELS = NODES.filter((n) => n.kind === "level");
export const levelsOfAct = (act) => LEVELS.filter((n) => n.act === act);

const BY_ID = new Map(NODES.map((n, i) => [n.id, { ...n, index: i }]));

export const getNode = (id) => BY_ID.get(id);
export const getNextNodeId = (id) =>
    NODES[BY_ID.get(id)?.index + 1]?.id ?? null;
export const pad2 = (n) => String(n).padStart(2, "0");

export function nodeLabel(node) {
    if (!node) return "";

    if (node.kind === "prologue") return "ПРОЛОГ";

    if (node.kind === "final") return `ФИНАЛ - ${node.title}`;

    const act = ACTS[node.act];
    if (node.kind === "actComplete") return `АКТ ${act.roman} · ПРОЙДЕН`;

    return `АКТ ${act.roman} · УРОВЕНЬ ${pad2(node.level)} - ${node.title}`;
}
