export const BUGS = [
    {
        id: "overlap",
        number: 1,
        letter: "P",
        label: "Text overlaps an icon",
        hint: "Not everything is aligned correctly.",
        rect: { x: 3, y: 2, w: 46, h: 14 },
    },
    {
        id: "float",
        number: 2,
        letter: "A",
        label: "Object ignores gravity",
        hint: "One object is ignoring gravity.",
        rect: { x: 92, y: 114, w: 20, h: 16 },
    },
    {
        id: "cat",
        number: 3,
        letter: "T",
        label: "Unauthorized animal in the UI",
        hint: "The UI contains an unauthorized animal.",
        rect: { x: 77, y: 160, w: 24, h: 20 },
    },
    {
        id: "extra",
        number: 4,
        letter: "C",
        label: "Extra inscription",
        hint: "Look for something that should not be there.",
        rect: { x: 210, y: 43, w: 58, h: 11 },
    },
    {
        id: "typo",
        number: 5,
        letter: "H",
        label: "Typo in a number",
        hint: "Check the numbers. One of them is suspicious.",
        rect: { x: 243, y: 2, w: 46, h: 14 },
    },
];

export const ANSWER = "PATCH";
export const SCENE_W = 320;
export const SCENE_H = 180;
