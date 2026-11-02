import { cx } from "@/lib/cx";
import { play } from "@/audio/audioEngine";
import s from "./button.module.css";

export default function TerminalButton({
    variant = "ghost",
    size,
    sound = "click",
    onClick,
    className,
    children,
    ...rest
}) {
    return (
        <button
            type="button"
            className={cx(s.btn, s[variant], size && s[size], className)}
            onClick={(e) => {
                if (sound) play(sound);

                onClick?.(e);
            }}
            {...rest}
        >
            {children}
        </button>
    );
}
