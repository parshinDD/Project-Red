import { useGameStore } from "@/store/gameStore";
import { useUiStore } from "@/store/uiStore";
import { START_HP } from "@/game/constants";
import { swapsFor } from "@/game/data/glitchText";
import Glitchable from "@/ui/Glitchable";
import s from "./shell.module.css";

export default function HpMeter() {
    const hp = useGameStore((st) => st.hp);
    const hit = useUiStore((st) => st.hpHit);

    return (
        <div
            className={s.meter}
            role="img"
            aria-label={`Health ${hp} of ${START_HP}`}
        >
            <Glitchable swaps={swapsFor("hp")}>HP</Glitchable>

            <span
                key={hit}
                className={`${s.cells} ${hit ? s.hit : ""}`}
                aria-hidden="true"
            >
                {Array.from({ length: START_HP }, (_, i) => (
                    <i key={i} className={s.cell} data-on={i < hp} />
                ))}
            </span>
            <output aria-hidden="true">
                {hp}/{START_HP}
            </output>
        </div>
    );
}
