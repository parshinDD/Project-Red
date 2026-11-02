import { lazy } from "react";

const scenes = {
    "prologue.boot": lazy(() => import("@/scenes/prologue/BootScene")),
    "prologue.agreement": lazy(
        () => import("@/scenes/prologue/AgreementScene"),
    ),
    "prologue.welcome": lazy(() => import("@/scenes/prologue/WelcomeScene")),
    "level.1": lazy(() => import("@/scenes/act1/level01/Level01BugHunt")),
    "level.2": lazy(() => import("@/scenes/act1/level02/Level02Patchnotes")),
    "level.3": lazy(() => import("@/scenes/act1/level03/Level03Memory")),
    "act.1.complete": lazy(() => import("@/scenes/ActComplete")),
    "act.2.complete": lazy(() => import("@/scenes/ActComplete")),
    "act.3.complete": lazy(() => import("@/scenes/ActComplete")),
};

export const getScene = (nodeId) => scenes[nodeId] ?? null;
