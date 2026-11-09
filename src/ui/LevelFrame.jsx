import { getNode } from "@/game/flow/nodes";
import { useGameStore } from "@/store/gameStore";
import { swapsFor } from "@/game/data/glitchText";
import Glitchable from "./Glitchable";
import s from "./frame.module.css";

export default function LevelFrame({ objective, children }) {
    const title = getNode(useGameStore((st) => st.nodeId))?.title;

    return (
        <div className={s.frame}>
            <header className={s.head}>
                <h1 className="srOnly">{title}</h1>
                {objective && (
                    <p className={s.objective}>
                        <Glitchable
                            className={s.label}
                            swaps={swapsFor("objective")}
                        >
                            Objective
                        </Glitchable>
                        {objective}
                    </p>
                )}
            </header>
            {children}
        </div>
    );
}
