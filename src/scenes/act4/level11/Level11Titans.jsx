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
    { text: "ФИНАЛЬНЫЙ ОТЧЕТ / ДОСТУП РАЗРЕШЕН", tone: "title" },
    { text: "" },
    { text: "Последовательность: S - E - A" },
    { text: "ПРИМЕЧАНИЕ СИСТЕМЫ:", tone: "dim", delay: 500 },
    {
        text: "Стены все еще выше большинства наших проблем.",
        delay: 450,
    },
    { text: "" },
    { text: "ФРАГМЕНТ 11 ВОССТАНОВЛЕН", tone: "err", glitch: true, delay: 500 },
];

const RECONSTRUCTION = [
    { k: "text", text: "РЕКОНСТРУКЦИЯ ЗАВЕРШЕНА", tone: "title", delay: 300 },
    { k: "gap", delay: 100 },
    { k: "text", text: "Три записи восстановлены.", delay: 350 },
    {
        k: "text",
        text: "Одна последовательность остается незавершенной.",
        tone: "dim",
        delay: 450,
    },
    {
        k: "text",
        text: "Введите последовательность, чтобы открыть финальный отчет.",
        tone: "dim",
        delay: 400,
    },
];

const STAGE_LABEL = {
    scale: "A · ПРОВЕРКА МАСШТАБА",
    identify: "B · СОПОСТАВЛЕНИЕ ОТЧЕТОВ",
    order: "B · СОПОСТАВЛЕНИЕ ОТЧЕТОВ",
    code: "C · ИЗВЛЕЧЕНИЕ КОДА",
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
    const { completed, complete, damage, say, next } = useSceneApi(11);

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
            damage();
            setNote("НЕСОВПАДЕНИЕ МАСШТАБА: сверьтесь с таблицей. Списан 1 HP.");
        }
    };

    const identify = () => {
        const conflict = checkIdentification(map);

        if (conflict) {
            play("error");
            damage();
            setNote(conflict);
            say("Неверное сопоставление стоит 1 HP.", "dim");
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
            damage();
            setNote(rejected);
            say("Неверное сопоставление стоит 1 HP.", "dim");
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
            damage();
            setNote("КОД ОТКЛОНЕН. Списан 1 HP.");
        }
    };

    return (
        <LevelFrame objective="Восстановите поврежденные разведотчеты.">
            <div className={s.layout}>
                {stageOpen ? (
                    <>
                        <p className={s.banner}>
                            <span>
                                РАЗВЕДКОРПУС / ВОССТАНОВЛЕНИЕ ПОЛЕВОГО АРХИВА
                            </span>
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
                            </thead>{" "}
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
                                                <span>РАЗВЕДОТЧЕТ {r.no}</span>
                                                <span className="tnum">
                                                    ВРЕМЯ: {r.time}
                                                </span>
                                            </header>
                                            <p className={s.meta}>
                                                СЕКТОР: <Damaged text="▓▓▓▓▓" />{" "}
                                                / НАБЛЮДАТЕЛЬ:{" "}
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
                                                        Отчет {r.no} - это
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
                                            Подтвердить сопоставление
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
                                                            ? `Слот ${i + 1}: отчет ${no}. Нажмите, чтобы убрать`
                                                            : `Слот ${i + 1} пуст`
                                                    }
                                                >
                                                    <span className={s.slotNo}>
                                                        СЛОТ {i + 1}
                                                    </span>
                                                    <strong>
                                                        {no
                                                            ? `Отчет ${no}`
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
                                                    Отчет {r.no}
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
                                                Отправить порядок
                                            </TerminalButton>
                                        </div>
                                    </>
                                )}
                            </section>
                        )}

                        {stage === "code" && (
                            <section className={s.step}>
                                <TerminalWindow title="Реконструкция">
                                    <TypedBlock
                                        items={RECONSTRUCTION}
                                        onDone={() => setCodeReady(true)}
                                    />
                                </TerminalWindow>

                                {codeReady && (
                                    <div className={s.restored}>
                                        {slots.map((no) => (
                                            <div key={no} className={s.slip}>
                                                <span>Отчет {no}</span>
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
                                            label="Последовательность"
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
                                            Отправить
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
                        title="Финальный отчет"
                        lines={FINAL_LINES}
                        shard={11}
                        onContinue={next}
                    />
                )}
            </div>
        </LevelFrame>
    );
}
