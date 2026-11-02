import { pad2 } from "./nodes";

const NB = "\u00A0\u00A0";
const cmd = (text, delay = 300) => ({
    k: "text",
    text: `> ${text}`,
    fast: true,
    delay,
});

const out = (label, status, extra = {}) => ({
    k: "leader",
    label: `${NB}${label}`,
    status,
    delay: 200,
    ...extra,
});

const bar = (duration = 0.9) => ({ k: "bar", duration, delay: 160 });

const SCRIPTS = {
    "prologue.boot>prologue.agreement": () => [
        cmd("cd /sessions/pending", 450),
        cmd("registry --lookup recipient"),
        out("looking up record", "FOUND"),
        out("flag", "ALREADY_REGISTERED", { tone: "warn" }),
        cmd("mount /agreements/player_test"),
        bar(1.0),
        out("reading terms.dat", "OK"),
        cmd("exec agreement.sh", 350),
    ],
    "prologue.agreement>prologue.welcome": ({ playerId }) => [
        cmd(`hash --verify ${playerId || "player"}`, 450),
        out("checksum", "MATCH"),
        cmd(`chmod u+w /profile/${playerId || "player"}`),
        cmd("cd /sessions/active"),
        cmd("alloc --session"),
        bar(0.9),
        out("allocating memory", "OK"),
        cmd("exec welcome.sh", 350),
    ],
};

export function consoleScript(from, to, ctx = {}) {
    const make = SCRIPTS[`${from.id}>${to.id}`];
    if (make) return make(ctx);

    return [
        cmd(`cd /${to.id.replace(/\./g, "/")}`, 450),
        cmd("load --module"),
        bar(0.8),
        out("module", "OK"),
        cmd(
            `exec ${to.level ? `level_${pad2(to.level)}` : to.title.toLowerCase()}.sh`,
            350,
        ),
    ];
}
