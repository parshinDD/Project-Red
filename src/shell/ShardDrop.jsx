import { useEffect } from "react";
import { useAnimate, useReducedMotion } from "motion/react";
import { useUiStore } from "@/store/uiStore";
import { GEMS } from "@/game/data/gems";
import { pad2 } from "@/game/flow/nodes";
import { play } from "@/audio/audioEngine";
import Gem from "@/ui/gem/Gem";
import s from "./drop.module.css";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function Drop({ n }) {
    const [scope, animate] = useAnimate();
    const reduce = useReducedMotion();

    useEffect(() => {
        let alive = true;
        (async () => {
            await sleep(350);
            if (!alive) return;

            animate("[data-dim]", { opacity: 1 }, { duration: 0.4 });

            if (reduce) {
                await animate(
                    "[data-gem]",
                    { opacity: [0, 1] },
                    { duration: 0.4 },
                );
            } else {
                setTimeout(() => play("gem"), 560);
                const h = window.innerHeight;

                await animate(
                    "[data-gem]",
                    {
                        y: [-h * 0.72, 0, -38, 0, -13, 0],
                        rotate: [-26, 0, 5, 0, -1.5, 0],
                        opacity: [0, 1, 1, 1, 1, 1],
                    },
                    {
                        duration: 1.3,
                        times: [0, 0.44, 0.62, 0.78, 0.9, 1],
                        ease: [
                            "easeIn",
                            "easeOut",
                            "easeIn",
                            "easeOut",
                            "easeIn",
                        ],
                    },
                );
            }

            if (!alive) return;

            await animate(
                "[data-cap]",
                { opacity: [0, 1], y: [8, 0] },
                { duration: 0.45 },
            );

            await sleep(1100);
            if (!alive) return;

            const gem = scope.current
                .querySelector("[data-gem]")
                .getBoundingClientRect();
            const to = document
                .querySelector("[data-shard-target]")
                ?.getBoundingClientRect();
            const dx = to ? to.x + to.width / 2 - (gem.x + gem.width / 2) : 0;
            const dy = to
                ? to.y + to.height / 2 - (gem.y + gem.height / 2)
                : -200;

            animate("[data-cap]", { opacity: 0 }, { duration: 0.25 });
            animate("[data-dim]", { opacity: 0 }, { duration: 0.7 });

            await animate(
                "[data-gem]",
                { x: dx, y: dy, scale: 0.16, opacity: [1, 1, 0.9] },
                { duration: 0.85, ease: [0.5, 0, 0.75, 0.35] },
            );
            if (alive) useUiStore.getState().endShardDrop();
        })();

        return () => {
            alive = false;
        };
    }, []);

    return (
        <div className={s.root} ref={scope} aria-hidden="true">
            <div className={s.dim} data-dim />
            <div className={s.gem} data-gem style={{ opacity: 0 }}>
                <Gem n={n} size="min(11rem, 34vw)" />
            </div>
            <div className={s.cap} data-cap>
                <span className={s.capTitle}>Shard {pad2(n)} recovered</span>
                <span className={s.capName}>{GEMS[n].name}</span>
            </div>
        </div>
    );
}

export default function ShardDrop() {
    const n = useUiStore((st) => st.shardDrop);
    return n ? <Drop key={n} n={n} /> : null;
}
