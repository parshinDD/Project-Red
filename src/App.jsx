import { useCallback, useState } from "react";
import { MotionConfig } from "motion/react";
import GameShell from "@/shell/GameShell";
import PowerGate from "@/shell/PowerGate";

export default function App() {
    const [powered, setPowered] = useState(false);
    const start = useCallback(() => setPowered(true), []);

    return (
        <MotionConfig reducedMotion="user">
            {powered ? <GameShell /> : <PowerGate onStart={start} />}
        </MotionConfig>
    );
}
