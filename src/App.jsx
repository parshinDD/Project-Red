import { useCallback, useState } from "react";
import { MotionConfig } from "motion/react";
import GameShell from "@/shell/GameShell";
import PowerGate from "@/shell/PowerGate";
import PhoneGate from "@/shell/PhoneGate";
import { useIsPhone } from "@/game/device";

export default function App() {
    const phone = useIsPhone();
    const [powered, setPowered] = useState(false);
    const start = useCallback(() => setPowered(true), []);

    if (phone) return <PhoneGate />;

    return (
        <MotionConfig reducedMotion="user">
            {powered ? <GameShell /> : <PowerGate onStart={start} />}
        </MotionConfig>
    );
}
