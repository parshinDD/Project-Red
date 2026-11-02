import { WOOD, GRAIN } from "@/crt/textures";
import Gem from "@/ui/gem/Gem";
import { TOTAL_SHARDS } from "@/game/constants";
import { pad2 } from "@/game/flow/nodes";
import { cx } from "@/lib/cx";
import v from "./vault.module.css";

const SLOTS = Array.from({ length: TOTAL_SHARDS }, (_, i) => i + 1);

export default function VaultBox({
    shards,
    hidden = null,
    selected,
    onSelect,
    pulse,
}) {
    return (
        <div
            className={v.box}
            style={{ backgroundImage: WOOD, backgroundSize: "700px 360px" }}
        >
            <div className={v.woodShade} />
            <div className={v.hinges} aria-hidden="true">
                <i />
                <i />
            </div>
            <div className={v.lining}>
                <div
                    className={v.nap}
                    style={{ backgroundImage: GRAIN }}
                    aria-hidden="true"
                />
                <div className={v.sheen} aria-hidden="true" />
                <div className={v.grid} role="group" aria-label="Shard seats">
                    {SLOTS.map((n) => {
                        const filled = shards.includes(n) && n !== hidden;

                        return (
                            <button
                                key={n}
                                type="button"
                                className={v.pocket}
                                style={{ "--i": n }}
                                onClick={() => onSelect?.(n)}
                                aria-pressed={selected === n}
                                aria-label={
                                    filled
                                        ? `Shard ${n}, recovered`
                                        : `Seat ${n}, empty`
                                }
                            >
                                <span
                                    className={cx(
                                        v.stone,
                                        filled && pulse === n && v.stoneNew,
                                    )}
                                >
                                    <Gem
                                        n={n}
                                        size="100%"
                                        empty={!filled}
                                        glow={filled}
                                    />
                                </span>
                                <span className={v.no} aria-hidden="true">
                                    {pad2(n)}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
            <div className={v.clasp} aria-hidden="true">
                <i />
            </div>
        </div>
    );
}
