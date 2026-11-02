import { useId } from "react";
import s from "./field.module.css";

export function TerminalField({ label, helper, error, id, ...input }) {
    const uid = useId();
    const fid = id ?? uid;

    const describedBy =
        [helper && `${fid}-h`, error && `${fid}-e`].filter(Boolean).join(" ") ||
        undefined;

    return (
        <div className={s.field}>
            <label htmlFor={fid} className={s.label}>
                {label}
            </label>
            <input
                id={fid}
                className={s.input}
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                aria-invalid={error ? "true" : undefined}
                aria-describedby={describedBy}
                {...input}
            />

            {helper && (
                <p id={`${fid}-h`} className={s.helper}>
                    {helper}
                </p>
            )}

            {error && (
                <p id={`${fid}-e`} role="alert" className={s.error}>
                    {error}
                </p>
            )}
        </div>
    );
}

export function TerminalCheckbox({ label, error, checked, onChange }) {
    const uid = useId();
    return (
        <div className={s.field}>
            <label className={s.check}>
                <input
                    type="checkbox"
                    className="srOnly"
                    checked={checked}
                    onChange={onChange}
                    aria-describedby={error ? `${uid}-e` : undefined}
                />
                <span className={s.box} aria-hidden="true" />
                <span>{label}</span>
            </label>
            {error && (
                <p id={`${uid}-e`} role="alert" className={s.error}>
                    {error}
                </p>
            )}
        </div>
    );
}
