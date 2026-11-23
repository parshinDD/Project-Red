export const BUGS = [
    {
        id: "overlap",
        number: 1,
        letter: "P",
        label: "Текст перекрывает иконку",
        hint: "Не все здесь выровнено правильно.",
        rect: { x: 3, y: 2, w: 46, h: 14 },
    },
    {
        id: "float",
        number: 2,
        letter: "A",
        label: "Объект игнорирует гравитацию",
        hint: "Один объект игнорирует гравитацию.",
        rect: { x: 92, y: 114, w: 20, h: 16 },
    },
    {
        id: "cat",
        number: 3,
        letter: "T",
        label: "Неавторизованное животное в интерфейсе",
        hint: "В интерфейсе есть неавторизованное животное.",
        rect: { x: 77, y: 160, w: 24, h: 20 },
    },
    {
        id: "extra",
        number: 4,
        letter: "C",
        label: "Лишняя надпись",
        hint: "Поищите то, чего здесь быть не должно.",
        rect: { x: 210, y: 43, w: 58, h: 11 },
    },
    {
        id: "typo",
        number: 5,
        letter: "H",
        label: "Опечатка в числе",
        hint: "Проверьте числа. Одно из них подозрительное.",
        rect: { x: 243, y: 2, w: 46, h: 14 },
    },
];

export const ANSWER = "PATCH";
export const SCENE_W = 320;
export const SCENE_H = 180;
