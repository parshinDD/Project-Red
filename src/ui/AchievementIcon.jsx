import s from "./achievement.module.css";

export default function AchievementIcon({ earned = true, size = "2.75rem" }) {
    return (
        <span
            className={`${s.icon} ${earned ? s.earned : s.locked}`}
            style={{ width: size, height: size }}
            aria-hidden="true"
        >
            <svg viewBox="0 0 48 48">
                <polygon
                    className={s.hex}
                    points="24,2 43,13 43,35 24,46 5,35 5,13"
                />
                <polygon
                    className={s.hexInner}
                    points="24,7 39,15.5 39,32.5 24,41 9,32.5 9,15.5"
                />
                {earned ? (
                    <polygon
                        className={s.star}
                        points="24,13 27.3,20.3 35,21.2 29.3,26.4 30.9,34 24,30.2 17.1,34 18.7,26.4 13,21.2 20.7,20.3"
                    />
                ) : (
                    <g className={s.lock}>
                        <rect x="17" y="22" width="14" height="11" rx="1.5" />
                        <path
                            d="M19.5 22 v-3.5 a4.5 4.5 0 0 1 9 0 V22"
                            fill="none"
                        />
                    </g>
                )}
            </svg>
        </span>
    );
}
