import { getNode } from "@/game/flow/nodes";
import { useGameStore } from "@/store/gameStore";
import s from "./frame.module.css";

export default function LevelFrame({ objective, children }) {
    const title = getNode(useGameStore((st) => st.nodeId))?.title;
    return (
        <div className={s.frame}>
            <header className={s.head}>
                <h1 className="srOnly">{title}</h1>
                {objective && (
                    <p className={s.objective}>
                        <span className={s.label}>Objective</span>
                        {objective}
                    </p>
                )}
            </header>
            {children}
        </div>
    );
}
