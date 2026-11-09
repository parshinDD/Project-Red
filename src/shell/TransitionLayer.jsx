import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useUiStore } from "@/store/uiStore";
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

    useEffect(() => {
        if (shows) return cueTransition(shows);

        return undefined;
    }, [shows]);

    useEffect(() => {
        const was = previous.current;
        previous.current = shows;

        if (was && !shows) cueTransitionExit(was);
    }, [shows]);

    return (
        <AnimatePresence>
            {shows && (
                <motion.div
                    key="cover"
                    className={s.root}
                    data-kind={shows.kind}
                    role="status"
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
