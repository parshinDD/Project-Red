import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
    FIRST_NODE,
    SAVE_VERSION,
    START_HP,
    STORAGE_KEY,
} from "@/game/constants";
import { getNode, levelsOfAct } from "@/game/flow/nodes";

const initialData = () => ({
    playerId: "",
    nodeId: FIRST_NODE,
    phase: "INTRO",
    hp: START_HP,
    attempt: 0,
    completedLevels: [],
    shards: [],
    completedActs: [],
    journal: [],
    achievements: [],
    levelProgress: {},
    hintsUsed: {},
    actHpLost: {},
    flags: {},
    finale: "LOCKED", // LOCKED | ASSEMBLY | ARCHIVE_READY | COMPLETE
    muted: false,
});

const DATA_KEYS = Object.keys(initialData());
const pick = (obj, keys) => Object.fromEntries(keys.map((k) => [k, obj[k]]));
const uniq = (arr, v) => (arr.includes(v) ? arr : [...arr, v]);

const phaseFor = (node) =>
    ({
        prologue: "INTRO",
        level: "LEVEL_ACTIVE",
        actComplete: "ACT_COMPLETE",
        final: "FINAL_ASSEMBLY",
    })[node.kind];

export const useGameStore = create(
    persist(
        (set, get) => ({
            ...initialData(),

            setNode: (nodeId) => {
                const node = getNode(nodeId);

                if (node) set({ nodeId, phase: phaseFor(node), attempt: 0 });
            },

            acceptAgreement: (playerId) =>
                set((s) => ({
                    playerId,
                    journal: uniq(s.journal, "agreement"),
                })),

            damage: () => {
                const s = get();
                if (s.phase !== "LEVEL_ACTIVE") return s.hp;

                const hp = Math.max(0, s.hp - 1);
                const act = getNode(s.nodeId).act;

                set({
                    hp,
                    phase: hp === 0 ? "LEVEL_FAILED" : s.phase,
                    actHpLost: {
                        ...s.actHpLost,
                        [act]: (s.actHpLost[act] ?? 0) + 1,
                    },
                });

                return hp;
            },
            respawnTo: (nodeId) =>
                set((s) => {
                    const node = getNode(nodeId);
                    const actLevels = levelsOfAct(node.act).map((n) => n.level);
                    const levelProgress = { ...s.levelProgress };

                    actLevels.forEach((l) => delete levelProgress[l]);

                    return {
                        nodeId,
                        phase: phaseFor(node),
                        hp: START_HP,
                        attempt: s.attempt + 1,
                        levelProgress,
                        completedLevels: s.completedLevels.filter(
                            (l) => !actLevels.includes(l),
                        ),
                    };
                }),

            completeLevel: (lvl) =>
                set((s) => ({
                    completedLevels: uniq(s.completedLevels, lvl),
                    shards: uniq(s.shards, lvl),
                    phase: "LEVEL_COMPLETE",
                })),

            setLevelProgress: (lvl, patch) =>
                set((s) => ({
                    levelProgress: {
                        ...s.levelProgress,
                        [lvl]: { ...s.levelProgress[lvl], ...patch },
                    },
                })),

            markActComplete: (act) => {
                const s = get();
                set({ completedActs: uniq(s.completedActs, act) });

                return { clean: !(s.actHpLost[act] > 0) };
            },

            bumpHint: (lvl) => {
                const n = (get().hintsUsed[lvl] ?? 0) + 1;
                set((s) => ({ hintsUsed: { ...s.hintsUsed, [lvl]: n } }));

                return n;
            },

            addJournal: (id) => {
                if (get().journal.includes(id)) return false;

                set((s) => ({ journal: [...s.journal, id] }));
                return true;
            },

            addAchievement: (id) => {
                if (get().achievements.includes(id)) return false;

                set((s) => ({ achievements: [...s.achievements, id] }));
                return true;
            },

            setFlag: (key, value = true) =>
                set((s) => ({ flags: { ...s.flags, [key]: value } })),

            setMuted: (muted) => set({ muted }),

            resetAll: () => set({ ...initialData(), muted: get().muted }),
        }),
        {
            name: STORAGE_KEY,
            version: SAVE_VERSION,
            storage: createJSONStorage(() => localStorage),

            partialize: (s) => pick(s, DATA_KEYS),
            merge: (persisted, current) => {
                const merged = { ...current, ...persisted };
                if (!getNode(merged.nodeId))
                    Object.assign(
                        merged,
                        pick(initialData(), ["nodeId", "phase"]),
                    );

                return merged;
            },
        },
    ),
);
