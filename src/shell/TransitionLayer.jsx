import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useUiStore } from "@/store/uiStore";
import { skipTransition } from "@/game/flow/navigator";
import Doors from "./transition/Doors";
import LevelCard from "./transition/LevelCard";
import ActCard from "./transition/ActCard";
import { cueTransition, cueTransitionExit } from "./transition/transitionAudio";
import s from "./transition/transition.module.css";

export default function TransitionLayer() {
    const transition = useUiStore((st) => st.transition);
    const reduce = useReducedMotion();
    const previous = useRef(null);

    const shows = transition && transition.kind !== "crt" ? transition : null;
    const skippable = shows?.kind === "act";

    useEffect(() => {
        if (shows) return cueTransition(shows);

        return undefined;
    }, [shows]);

    useEffect(() => {
        const was = previous.current;
        previous.current = shows;

        if (was && !shows) cueTransitionExit(was);
    }, [shows]);

    useEffect(() => {
        if (!skippable) return undefined;

        const onKey = (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                skipTransition();
            }
        };

        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [skippable]);

    return (
        <AnimatePresence>
            {shows && (
                <motion.div
                    key="cover"
                    className={s.root}
                    data-kind={shows.kind}
                    role="status"
                    onPointerDown={skippable ? skipTransition : undefined}
                >
                    <Doors kind={shows.kind} reduce={reduce} />
                    {shows.kind === "level" && (
                        <LevelCard card={shows.card} reduce={reduce} />
                    )}
                    {shows.kind === "act" && (
                        <ActCard card={shows.card} reduce={reduce} />
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
