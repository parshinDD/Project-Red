export const OBJECTS = [
    {
        id: "colossal",
        name: "Колоссальный титан",
        m: 60,
        sign: "Без кожи, густой пар",
    },
    { id: "wall", name: "Стена", m: 50, sign: "Не титан" },
    {
        id: "armored",
        name: "Бронированный титан",
        m: 15,
        sign: "Массивные пластины",
    },
    {
        id: "female",
        name: "Женская особь титана",
        m: 14,
        sign: "Кристаллизация, быстрая",
    },
];

export const OBJECT = Object.fromEntries(OBJECTS.map((o) => [o.id, o]));
export const WALL = OBJECT.wall.m;

export const SCALE_QUESTION =
    "На сколько метров Колоссальный титан выше стены?";
export const SCALE_OPTIONS = [5, 10, 15, 20];
export const SCALE_ANSWER = 10;

export const REPORTS = [
    {
        no: "01",
        time: "08:40",
        chk: "A",
        answer: "female",
        stamp: "ПОВРЕЖДЕНО",
        carrier: "Бумага, следы воды",
        rot: -0.7,
        tear: 0,
        body: [
            "Объект быстрый, избегает прямого контакта. ▓▓▓▓ покрыты прозрачным слоем, похожим на кристалл. Удары ▓▓▓▓ не оставили следов.",
            "По высоте ниже ▓▓▓▓▓▓▓▓▓▓ ровно на 1 м.",
            "Стена значительно выше объекта.",
        ],
    },
    {
        no: "02",
        time: "13:15",
        chk: "S",
        answer: "colossal",
        stamp: "КОПИЯ",
        carrier: "Бумага, подпалины по краю",
        rot: 0.5,
        tear: 1,
        body: [
            "Над ▓▓▓▓▓▓▓ поднимается силуэт без кожи, вокруг тела густой пар. Подойти из-за жара невозможно.",
            "Объект возвышается над стеной.",
            "Остальные объекты из таблицы ниже.",
        ],
    },
    {
        no: "03",
        time: "06:05",
        chk: "E",
        answer: "armored",
        stamp: "ПРОВЕРИТЬ",
        carrier: "Бумага, надрыв",
        rot: -0.3,
        tear: 2,
        body: [
            "Тело закрыто массивными пластинами. Ворота ▓▓▓▓▓ не устояли.",
            "Объект ниже стены, но выше ▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ровно на 1 м.",
        ],
    },
];

export const REPORT = Object.fromEntries(REPORTS.map((r) => [r.no, r]));

const height = (map, no) => OBJECT[map[no]].m;

export function checkIdentification(map) {
    if (height(map, "03") - height(map, "01") !== 1)
        return "IDENTIFICATION CONFLICT: Report 01 and Report 03 cannot describe the same height class.";

    if (height(map, "02") <= WALL)
        return "IDENTIFICATION CONFLICT: Report 02 does not rise above the wall.";

    return null;
}

export function checkOrder(slots, map) {
    for (let i = 0; i < slots.length - 1; i++)
        if (height(map, slots[i]) <= height(map, slots[i + 1]))
            return `ORDER REJECTED: Report ${slots[i]} is not taller than Report ${slots[i + 1]}`;

    return null;
}

export const SEQUENCE = (slots) => slots.map((no) => REPORT[no].chk).join("");

export const isCode = (value, expected) => {
    const v = value
        .toUpperCase()
        .replace(/[\s-]/g, "")
        .replace(/С/g, "S")
        .replace(/Е/g, "E")
        .replace(/А/g, "A");

    return v === expected;
};
