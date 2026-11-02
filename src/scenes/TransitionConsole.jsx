import { useUiStore } from "@/store/uiStore";
import { TerminalWindow } from "@/ui/Terminal";
import TypedBlock from "@/ui/TypedBlock";
import { finishCutRun } from "@/game/flow/navigator";
import s from "@/scenes/prologue/prologue.module.css";

export default function TransitionConsole() {
    const lines = useUiStore((st) => st.cutLines) ?? [];

    return (
        <div className={s.screen}>
            <TerminalWindow title="Project Red / system">
                <TypedBlock items={lines} onDone={finishCutRun} />
            </TerminalWindow>
        </div>
    );
}
