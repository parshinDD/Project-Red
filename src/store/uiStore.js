import { create } from "zustand";

let nextId = 1;

export const useUiStore = create((set, get) => ({
    journalOpen: false,
    menuOpen: false,
    vaultOpen: false,
    mood: null,
    screenCut: null,
    cutLines: null,
    shardDrop: null,
    typing: 0,
    ledFlash: null,
    transition: null,
    messages: [],
    toasts: [],
    hpHit: 0,
    shardPulse: 0,

    setJournalOpen: (journalOpen) =>
        set({ journalOpen, menuOpen: false, vaultOpen: false }),

    toggleJournal: () =>
        set((s) => ({
            journalOpen: !s.journalOpen,
            menuOpen: false,
            vaultOpen: false,
        })),

    setMenuOpen: (menuOpen) =>
        set({ menuOpen, journalOpen: false, vaultOpen: false }),

    setVaultOpen: (vaultOpen) =>
        set({ vaultOpen, journalOpen: false, menuOpen: false }),

    toggleVault: () =>
        set((s) => ({
            vaultOpen: !s.vaultOpen,
            journalOpen: false,
            menuOpen: false,
        })),

    setMood: (mood) => set({ mood }),

    setScreenCut: (screenCut) => set({ screenCut }),

    setCutLines: (cutLines) => set({ cutLines }),

    typingStart: () => set((s) => ({ typing: s.typing + 1 })),

    typingEnd: () => set((s) => ({ typing: Math.max(0, s.typing - 1) })),

    flashLed: (mode, ms = 900) => {
        const id = nextId++;

        set({ ledFlash: { id, mode } });
        setTimeout(() => {
            if (get().ledFlash?.id === id) set({ ledFlash: null });
        }, ms);
    },

    beginTransition: (transition) => set({ transition }),

    endTransition: () => set({ transition: null }),

    pushMessage: (text, tone = "fg") =>
        set((s) => ({
            messages: [...s.messages, { id: nextId++, text, tone }].slice(-3),
        })),

    clearMessages: () => set({ messages: [] }),

    pushToast: (toast) => {
        const id = nextId++;

        set((s) => ({ toasts: [...s.toasts, { id, ...toast }].slice(-3) }));
        setTimeout(
            () => get().dismissToast(id),
            toast.kind === "achievement" ? 6000 : 4200,
        );
    },

    dismissToast: (id) =>
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

    bumpHpHit: () => set((s) => ({ hpHit: s.hpHit + 1 })),

    pulseShard: (n) => set({ shardPulse: n }),

    startShardDrop: (n) => set({ shardDrop: n }),

    endShardDrop: () =>
        set((s) => ({
            shardPulse: s.shardDrop ?? s.shardPulse,
            shardDrop: null,
        })),
}));
