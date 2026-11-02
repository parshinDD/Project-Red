import { useRef } from "react";
import { motion } from "motion/react";
import { ACTS, levelsOfAct, pad2 } from "@/game/flow/nodes";
import { ACT_CARD, DEFAULT_ACT_CARD } from "@/game/flow/actCards";
import { TIMING, ACT_CUES, TITLE_FLICKER } from "@/game/flow/timing";
import { EASE_OUT } from "./ease";
import ModuleRail from "./ModuleRail";
import Motif from "./motifs";
import { useFlicker } from "./useFlicker";
import s from "./transition.module.css";

export default function ActCard({ card, reduce }) {
    const { cover } = TIMING.act;

    const act = ACTS[card.act];
    const info = ACT_CARD[card.act] ?? DEFAULT_ACT_CARD;
    const levels = levelsOfAct(card.act);
    const first = levels[0]?.level ?? card.level;
    const last = levels[levels.length - 1]?.level ?? first;
    const sec = (ms) => (cover + ms) / 1000;

    const roman = useRef(null);

    useFlicker(roman, TITLE_FLICKER, cover + ACT_CUES.title, reduce);

    const slide = (delay) => ({
        initial: {
            opacity: 0,
            transform: reduce ? "translateX(0px)" : "translateX(-14px)",
        },
        animate: {
            opacity: 1,
            transform: "translateX(0px)",
            transition: { delay, duration: 0.22, ease: EASE_OUT },
        },
    });

    const wipe = reduce
        ? {
              initial: { opacity: 0 },
              animate: {
                  opacity: 1,
                  transition: { delay: sec(ACT_CUES.name), duration: 0.2 },
              },
          }
        : {
              initial: { clipPath: "inset(0 100% 0 0)" },
              animate: {
                  clipPath: "inset(0 0% 0 0)",
                  transition: {
                      delay: sec(ACT_CUES.name),
                      duration: 0.34,
                      ease: "linear",
                  },
              },
          };

    return (
        <motion.div
            className={`${s.card} ${s.actCard}`}
            data-act={card.act}
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
        >
            <div className={s.motif}>
                <Motif
                    kind={info.motif}
                    delay={sec(ACT_CUES.name)}
                    delayMs={cover + ACT_CUES.name}
                    reduce={reduce}
                />
            </div>

            <div className={s.actCol}>
                <p className="srOnly">{`Act ${act.roman}: ${act.name}. Levels ${pad2(first)} to ${pad2(last)}.`}</p>

                <motion.p
                    className={s.actKicker}
                    aria-hidden="true"
                    {...slide(sec(ACT_CUES.title - 150))}
                >
                    {info.kicker}
                </motion.p>
                <h2 className={s.actRoman} ref={roman} aria-hidden="true">
                    ACT {act.roman}
                </h2>
                <motion.p className={s.actName} aria-hidden="true" {...wipe}>
                    {act.name}
                </motion.p>

                <ol className={s.roster} aria-hidden="true">
                    {levels.map((l, i) => (
                        <motion.li
                            key={l.level}
                            className={s.row}
                            data-next={i === 0 ? "" : undefined}
                            {...slide(
                                sec(ACT_CUES.roster + i * ACT_CUES.rosterStep),
                            )}
                        >
                            <span className="tnum">{pad2(l.level)}</span>
                            <span>{l.title}</span>
                            <span className={s.rowState}>
                                {i === 0 ? "READY" : "LOCKED"}
                            </span>
                        </motion.li>
                    ))}
                </ol>

                <ModuleRail
                    current={first}
                    lightAct={card.act}
                    delay={cover + ACT_CUES.roster}
                    step={ACT_CUES.rosterStep}
                    caption={`LEVELS ${pad2(first)}–${pad2(last)}`}
                />

                <div className={s.log} aria-hidden="true">
                    {info.log.map((line, i) => (
                        <motion.span
                            key={line}
                            initial={{ opacity: 0 }}
                            animate={{
                                opacity: 1,
                                transition: {
                                    delay: sec(
                                        ACT_CUES.log + i * ACT_CUES.logStep,
                                    ),
                                    duration: 0.001,
                                },
                            }}
                        >
                            &gt; {line}
                            {i === info.log.length - 1 && (
                                <i className={s.cursor} />
                            )}
                        </motion.span>
                    ))}
                </div>
            </div>

            <motion.p
                className={s.skip}
                aria-hidden="true"
                initial={{ opacity: 0 }}
                animate={{
                    opacity: 0.75,
                    transition: {
                        delay: sec(ACT_CUES.skipHint),
                        duration: 0.3,
                    },
                }}
            >
                ENTER - SKIP
            </motion.p>
        </motion.div>
    );
}
