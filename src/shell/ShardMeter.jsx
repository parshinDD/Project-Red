import { useGameStore } from "@/store/gameStore";
import { useUiStore } from "@/store/uiStore";
import Gem from "@/ui/gem/Gem";
import { TOTAL_SHARDS } from "@/game/constants";
import s from "./shell.module.css";

export default function ShardMeter() {
    const shards = useGameStore((st) => st.shards);
    const drop = useUiStore((st) => st.shardDrop);
    const pulse = useUiStore((st) => st.shardPulse);
    const open = useUiStore((st) => st.vaultOpen);
    const toggle = useUiStore((st) => st.toggleVault);

    const have = shards.filter((n) => n !== drop);
    const last = have.length ? have[have.length - 1] : null;

    return (
        <button
            type="button"
            className={`${s.meter} ${s.meterBtn}`}
            onClick={toggle}
            aria-expanded={open}
            aria-keyshortcuts="I"
            aria-label={`Shard box, ${have.length} of ${TOTAL_SHARDS} recovered`}
            data-shard-target
        >
            <span
                key={last ?? 0}
                className={`${s.gemSlot} ${last && pulse === last ? s.gemPop : ""}`}
            >
                {last ? (
                    <Gem n={last} size="1.5rem" glow={false} />
                ) : (
                    <Gem n={1} size="1.5rem" empty ghost />
                )}
            </span>
            <output aria-hidden="true">
                {String(have.length).padStart(2, "0")}/{TOTAL_SHARDS}
            </output>
        </button>
    );
}
