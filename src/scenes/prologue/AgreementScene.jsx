import { useState } from "react";
import { TerminalWindow } from "@/ui/Terminal";
import TypedBlock from "@/ui/TypedBlock";
import { TerminalField, TerminalCheckbox } from "@/ui/TerminalField";
import TerminalButton from "@/ui/TerminalButton";
import { useGameStore } from "@/store/gameStore";
import { useUiStore } from "@/store/uiStore";
import { navigate } from "@/game/flow/navigator";
import { grantAchievement, grantJournal } from "@/game/rewards";
import { REQUIRED_PLAYER_ID } from "@/game/constants";
import { play } from "@/audio/audioEngine";
import s from "./prologue.module.css";

const TERMS = [
    {
        k: "text",
        as: "h1",
        text: "PLAYER TEST AGREEMENT",
        tone: "title",
        delay: 500,
    },
    { k: "gap", delay: 120 },
    {
        k: "text",
        text: "By continuing, you agree to test an experimental build.",
        delay: 200,
    },
    { k: "gap", delay: 120 },
    {
        k: "text",
        text: "The test may include puzzles, memory checks, visual anomalies and several questionable design decisions.",
        delay: 200,
    },
    { k: "gap", delay: 120 },
    { k: "text", text: "Progress is stored locally.", delay: 200 },
    { k: "gap", delay: 120 },
    {
        k: "text",
        text: "The developer accepts no responsibility for unusually persistent cats, suspicious patch notes or unexpected rewards.",
        delay: 200,
    },
    { k: "gap", delay: 120 },
    {
        k: "text",
        text: "By completing this test, you may receive a birthday-related item.",
        delay: 200,
    },
];

export default function AgreementScene() {
    const [typed, setTyped] = useState(false);
    const [playerId, setPlayerId] = useState("");
    const [read, setRead] = useState(false);
    const [errors, setErrors] = useState({});
    const [idFails, setIdFails] = useState(0);
    const [clauseOpen, setClauseOpen] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        const next = {};
        const idOk = playerId.trim().toLowerCase() === REQUIRED_PLAYER_ID;

        if (!idOk) {
            next.id =
                idFails >= 2
                    ? "PLAYER ID rejected. Registry note: the ID is a single lowercase word of four letters."
                    : "PLAYER ID not found in the recipient registry.";
            setIdFails((n) => n + 1);
        }

        if (!read) next.read = "Confirmation required.";

        setErrors(next);
        if (Object.keys(next).length) {
            play("error");
            useUiStore.getState().flashLed("error");

            return;
        }

        useGameStore.getState().acceptAgreement(REQUIRED_PLAYER_ID);
        play("confirm");
        useUiStore.getState().flashLed("ok");
        navigate("prologue.welcome");
    };

    const openClause = () => {
        setClauseOpen(true);
        play("glitch");
        grantJournal("fine-print");
        grantAchievement("read-the-fine-print");
    };

    return (
        <div className={s.screen}>
            <TerminalWindow title="Project Red / agreement">
                <div className={s.terms}>
                    <TypedBlock items={TERMS} onDone={() => setTyped(true)} />
                </div>

                {typed && (
                    <div className={s.reveal}>
                        <button
                            type="button"
                            className={s.fine}
                            onClick={openClause}
                            aria-expanded={clauseOpen}
                        >
                            § 12.b
                        </button>
                        {clauseOpen && (
                            <p className={s.clause}>
                                § 12.b - The build number is not random. This
                                clause was removed in review for being too
                                obvious.
                            </p>
                        )}

                        <form className={s.form} onSubmit={submit} noValidate>
                            <TerminalField
                                label="Player ID"
                                helper="Registered recipients only."
                                value={playerId}
                                onChange={(e) => setPlayerId(e.target.value)}
                                error={errors.id}
                                autoFocus
                            />
                            <TerminalCheckbox
                                label="I have read the terms"
                                checked={read}
                                onChange={(e) => setRead(e.target.checked)}
                                error={errors.read}
                            />
                            <TerminalButton
                                variant="primary"
                                type="submit"
                                sound={null}
                            >
                                Accept &amp; launch
                            </TerminalButton>
                        </form>
                    </div>
                )}
            </TerminalWindow>
        </div>
    );
}
