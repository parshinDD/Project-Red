import { useEffect, useRef } from "react";
import { cx } from "@/lib/cx";
import { play } from "@/audio/audioEngine";
import { useUiStore } from "@/store/uiStore";
import s from "./terminal.module.css";

export function TerminalWindow({ title, children, className, ...rest }) {
    return (
        <section className={cx(s.window, className)} {...rest}>
            <header className={s.titlebar}>
                <span>{title}</span>
                <span className={s.pips} aria-hidden="true">
                    <i />
                    <i />
                    <i />
                </span>
            </header>
            <div className={s.body}>{children}</div>
        </section>
    );
}

const reducedMotion = () =>
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
const TICK_MS = 16;

export function TermLine({
    text,
    tone = "fg",
    as: Tag = "p",
    silent = false,
    glitch = false,
    instant = false,
    fast = false,
    onDone,
}) {
    const typed = useRef(null);
    const rest = useRef(null);
    const caret = useRef(null);
    const doneRef = useRef(onDone);

    doneRef.current = onDone;

    useEffect(() => {
        if (glitch) play("glitch");
        else if (!silent) play("tick");
    }, []);

    useEffect(() => {
        const a = typed.current;
        const b = rest.current;
        const c = caret.current;

        const finish = () => {
            a.textContent = text;
            b.textContent = "";
            c.style.display = "none";
            doneRef.current?.();
        };

        if (instant || !text || reducedMotion()) {
            finish();
            return;
        }

        c.style.display = "";
        let step = text.length > 90 ? 3 : text.length > 45 ? 2 : 1;
        if (fast) step *= 2;

        let i = 0;
        let active = true;

        useUiStore.getState().typingStart();
        const end = () => {
            if (active) {
                active = false;
                useUiStore.getState().typingEnd();
            }
        };

        const id = setInterval(() => {
            i = Math.min(text.length, i + step);
            a.textContent = text.slice(0, i);
            b.textContent = text.slice(i);

            if (i >= text.length) {
                clearInterval(id);
                c.style.display = "none";
                end();
                doneRef.current?.();
            }
        }, TICK_MS);

        return () => {
            clearInterval(id);
            end();
        };
    }, [text, instant]);

    return (
        <Tag className={cx(s.line, s[tone], glitch && s.glitch)}>
            <span className="srOnly">{text}</span>
            <span ref={typed} aria-hidden="true" />
            <span ref={caret} className={s.caret} aria-hidden="true" />
            <span ref={rest} className={s.ghost} aria-hidden="true">
                {text}
            </span>
        </Tag>
    );
}

export const TermGap = () => <div className={s.gap} aria-hidden="true" />;

export function TermLeader({ label, status, tone = "fg" }) {
    useEffect(() => play("tick"), []);

    return (
        <p className={s.leader}>
            <span>{label}</span>
            <span className={s.dots} aria-hidden="true" />
            <span className={cx(s.status, s[tone])}>{status}</span>
        </p>
    );
}

export { s as terminalStyles };
