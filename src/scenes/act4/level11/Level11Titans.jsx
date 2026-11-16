import { useState } from "react";
import { useSceneApi } from "@/game/hooks/useSceneApi";
import { play } from "@/audio/audioEngine";
import { cx } from "@/lib/cx";
import { TerminalWindow } from "@/ui/Terminal";
import TypedBlock from "@/ui/TypedBlock";
import TerminalButton from "@/ui/TerminalButton";
import { TerminalField } from "@/ui/TerminalField";
import CompletePanel from "@/ui/CompletePanel";
import LevelFrame from "@/ui/LevelFrame";
import {
    OBJECT,
    OBJECTS,
    REPORT,
    REPORTS,
    SCALE_ANSWER,
    SCALE_OPTIONS,
    SCALE_QUESTION,
    SEQUENCE,
    checkIdentification,
    checkOrder,
    isCode,
} from "./titans";
import s from "./level11.module.css";

const FINAL_LINES = [
    { text: "FINAL REPORT / ACCESS GRANTED", tone: "title" },
    { text: "" },
    { text: "Sequence: S - E - A" },
    { text: "SYSTEM NOTE:", tone: "dim", delay: 500 },
    {
        text: "Walls are still taller than most of our problems.",
        delay: 450,
    },
    { text: "" },
    { text: "FRAGMENT 11 RECOVERED", tone: "err", glitch: true, delay: 500 },
];

const RECONSTRUCTION = [
    { k: "text", text: "RECONSTRUCTION COMPLETE", tone: "title", delay: 300 },
    { k: "gap", delay: 100 },
    { k: "text", text: "Three records restored.", delay: 350 },
    {
        k: "text",
        text: "One sequence remains incomplete.",
        tone: "dim",
        delay: 450,
    },
    {
        k: "text",
        text: "Enter the sequence to open the final report.",
        tone: "dim",
        delay: 400,
    },
];

const STAGE_LABEL = {
    scale: "A · SCALE CHECK",
    identify: "B · REPORT MATCHING",
    order: "B · REPORT MATCHING",
    code: "C · CODE EXTRACTION",
};

function Damaged({ text }) {
    return text.split(/(▓+)/).map((part, i) =>
        part.startsWith("▓") ? (
            <span key={i} className={s.gap} aria-label="damaged">
                {part}
            </span>
        ) : (
            part
        ),
    );
}

export default function Level11Titans() {
    const { completed, complete, next } = useSceneApi(11);

    const [stage, setStage] = useState(completed ? "done" : "scale");
    const [map, setMap] = useState({ "01": "", "02": "", "03": "" });
    const [slots, setSlots] = useState([null, null, null]);
    const [code, setCode] = useState("");
    const [codeReady, setCodeReady] = useState(false);
    const [note, setNote] = useState("");

    const stageOpen = stage !== "done" && !completed;
    const placed = slots.filter(Boolean);
    const pool = REPORTS.filter((r) => !slots.includes(r.no));

    const answerScale = (m) => {
        if (m === SCALE_ANSWER) {
            play("found");
            setNote("");
            setStage("identify");
        } else {
            play("error");
            setNote("SCALE MISMATCH: recheck the table.");
        }
    };

    const identify = () => {
        const conflict = checkIdentification(map);

        if (conflict) {
            play("error");
            setNote(conflict);
        } else {
            play("cardFlip");
            play("found");
            setNote("");
            setStage("order");
        }
    };

    const place = (no) => {
        const i = slots.indexOf(null);
        if (i < 0) return;

        play("click");
        setNote("");
        setSlots((cur) => cur.map((v, k) => (k === i ? no : v)));
    };

    const unplace = (i) => {
        if (!slots[i]) return;

        play("click");
        setNote("");
        setSlots((cur) => cur.map((v, k) => (k === i ? null : v)));
    };

    const submitOrder = () => {
        const rejected = checkOrder(slots, map);

        if (rejected) {
            play("error");
            setNote(rejected);
        } else {
            play("trialPass");
            setNote("");
            setStage("code");
        }
    };

    const submitCode = () => {
        if (!code.trim()) return;

        if (isCode(code, SEQUENCE(slots))) {
            play("trialPass");
            setNote("");
            setStage("done");
            complete();
        } else {
            play("error");
            setNote("CODE REJECTED.");
        }
    };

    return (
        <LevelFrame objective="Restore the damaged intelligence reports.">
            <div className={s.layout}>
                {stageOpen ? (
                    <>
                        <p className={s.banner}>
                            <span>SURVEY CORPS / FIELD ARCHIVE RECOVERY</span>
                            <span>{STAGE_LABEL[stage]}</span>
                        </p>

                        <p className={s.found}>
                            Папка найдена без описи и титульного листа. Три
                            листа, часть сведений утрачена. Справочная таблица
                            на отдельном бланке уцелела.
                        </p>

                        <p className={s.caption} aria-hidden="true">
                            <span>СПРАВОЧНЫЙ БЛАНК</span>
                            <span>сохранность: хорошая</span>
                        </p>

                        <table className={s.board}>
                            <caption className="srOnly">
                                Известные данные об объектах
                            </caption>
                            <thead>
                                <tr>
                                    <th scope="col">Объект</th>
                                    <th scope="col">Данные</th>
                                    <th scope="col">Признаки наблюдения</th>
                                </tr>
                            </thead>
                            <tbody>
                                {OBJECTS.map((o) => (
                                    <tr key={o.id}>
                                        <th scope="row">{o.name}</th>
                                        <td>
                                            <span className="tnum">
                                                {o.m} м
                                            </span>
                                            <i
                                                className={s.bar}
                                                style={{ "--k": o.m / 60 }}
                                                aria-hidden="true"
                                            />
                                        </td>
                                        <td>{o.sign}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {stage === "scale" && (
                            <section className={s.step}>
                                <p className={s.question}>{SCALE_QUESTION}</p>
                                <div className={s.options}>
                                    {SCALE_OPTIONS.map((m) => (
                                        <TerminalButton
                                            key={m}
                                            onClick={() => answerScale(m)}
                                            sound={null}
                                        >
                                            {m} м
                                        </TerminalButton>
                                    ))}
                                </div>
                            </section>
                        )}

                        {(stage === "identify" || stage === "order") && (
                            <section className={s.step}>
                                <p className={s.question}>
                                    {stage === "identify"
                                        ? "Сопоставьте каждый отчет с объектом из таблицы."
                                        : "Поместите листы в слоты. Порядок имеет значение."}
                                </p>

                                <div className={s.reports}>
                                    {REPORTS.map((r) => (
                                        <article
                                            key={r.no}
                                            className={s.report}
                                            data-tear={r.tear}
                                            style={{ "--rot": `${r.rot}deg` }}
                                        >
                                            <p className={s.office}>
                                                РАЗВЕДКОРПУС · ПОЛЕВОЙ ОТЧЕТ
                                            </p>
                                            <header className={s.rhead}>
                                                <span>RECON REPORT {r.no}</span>
                                                <span className="tnum">
                                                    TIME: {r.time}
                                                </span>
                                            </header>
                                            <p className={s.meta}>
                                                SECTOR: <Damaged text="▓▓▓▓▓" />{" "}
                                                / OBSERVER:{" "}
                                                <Damaged text="▓▓▓▓▓▓" />
                                            </p>
                                            {r.body.map((l) => (
                                                <p key={l} className={s.line}>
                                                    <Damaged text={l} />
                                                </p>
                                            ))}
                                            <div className={s.seal}>
                                                <p className={s.chk}>
                                                    CHK: {r.chk}
                                                </p>
                                                <span
                                                    className={s.stamp}
                                                    aria-hidden="true"
                                                >
                                                    {r.stamp}
                                                </span>
                                            </div>
                                            <p className={s.carrier}>
                                                Носитель: {r.carrier}
                                            </p>

                                            {stage === "identify" ? (
                                                <label className={s.pick}>
                                                    <span>
                                                        Report {r.no} is
                                                    </span>
                                                    <select
                                                        value={map[r.no]}
                                                        onChange={(e) => {
                                                            setNote("");
                                                            setMap((m) => ({
                                                                ...m,
                                                                [r.no]: e.target
                                                                    .value,
                                                            }));
                                                        }}
                                                    >
                                                        <option value="">
                                                            -
                                                        </option>
                                                        {OBJECTS.map((o) => (
                                                            <option
                                                                key={o.id}
                                                                value={o.id}
                                                            >
                                                                {o.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </label>
                                            ) : (
                                                <p className={s.resolved}>
                                                    {OBJECT[map[r.no]].name} ·{" "}
                                                    <span className="tnum">
                                                        {OBJECT[map[r.no]].m} м
                                                    </span>
                                                </p>
                                            )}
                                        </article>
                                    ))}
                                </div>

                                {stage === "identify" && (
                                    <div className={s.actions}>
                                        <TerminalButton
                                            variant="primary"
                                            onClick={identify}
                                            disabled={Object.values(map).some(
                                                (v) => !v,
                                            )}
                                            sound={null}
                                        >
                                            Confirm identification
                                        </TerminalButton>
                                    </div>
                                )}

                                {stage === "order" && (
                                    <>
                                        <div className={s.slots}>
                                            {slots.map((no, i) => (
                                                <button
                                                    key={i}
                                                    type="button"
                                                    className={cx(
                                                        s.slot,
                                                        no && s.filled,
                                                    )}
                                                    onClick={() => unplace(i)}
                                                    aria-label={
                                                        no
                                                            ? `Slot ${i + 1}: Report ${no}. Click to remove`
                                                            : `Slot ${i + 1} is empty`
                                                    }
                                                >
                                                    <span className={s.slotNo}>
                                                        SLOT {i + 1}
                                                    </span>
                                                    <strong>
                                                        {no
                                                            ? `Report ${no}`
                                                            : "-"}
                                                    </strong>
                                                </button>
                                            ))}
                                        </div>

                                        <div className={s.pool}>
                                            {pool.map((r) => (
                                                <TerminalButton
                                                    key={r.no}
                                                    onClick={() => place(r.no)}
                                                    sound={null}
                                                >
                                                    Report {r.no}
                                                </TerminalButton>
                                            ))}
                                        </div>

                                        <div className={s.actions}>
                                            <TerminalButton
                                                variant="primary"
                                                onClick={submitOrder}
                                                disabled={placed.length < 3}
                                                sound={null}
                                            >
                                                Submit order
                                            </TerminalButton>
                                        </div>
                                    </>
                                )}
                            </section>
                        )}

                        {stage === "code" && (
                            <section className={s.step}>
                                <TerminalWindow title="Reconstruction">
                                    <TypedBlock
                                        items={RECONSTRUCTION}
                                        onDone={() => setCodeReady(true)}
                                    />
                                </TerminalWindow>

                                {codeReady && (
                                    <div className={s.restored}>
                                        {slots.map((no) => (
                                            <div key={no} className={s.slip}>
                                                <span>Report {no}</span>
                                                <strong>
                                                    CHK: {REPORT[no].chk}
                                                </strong>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {codeReady && (
                                    <div className={s.codeRow}>
                                        <TerminalField
                                            label="Sequence"
                                            value={code}
                                            onChange={(e) => {
                                                setNote("");
                                                setCode(e.target.value);
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter")
                                                    submitCode();
                                            }}
                                            maxLength={12}
                                        />
                                        <TerminalButton
                                            variant="primary"
                                            onClick={submitCode}
                                            disabled={!code.trim()}
                                            sound={null}
                                        >
                                            Submit
                                        </TerminalButton>
                                    </div>
                                )}
                            </section>
                        )}

                        {note && (
                            <p className={s.note} role="alert">
                                {note}
                            </p>
                        )}
                    </>
                ) : (
                    <CompletePanel
                        title="Final report"
                        lines={FINAL_LINES}
                        shard={11}
                        onContinue={next}
                    />
                )}
            </div>
        </LevelFrame>
    );
}
