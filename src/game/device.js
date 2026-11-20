import { useEffect, useState } from "react";

const QUERY = "(pointer: coarse) and (max-width: 900px)";

export function useIsPhone() {
    const [phone, setPhone] = useState(
        () => window.matchMedia?.(QUERY).matches ?? false,
    );

    useEffect(() => {
        const mq = window.matchMedia(QUERY);
        const onChange = () => setPhone(mq.matches);

        mq.addEventListener?.("change", onChange);

        return () => mq.removeEventListener?.("change", onChange);
    }, []);

    return phone;
}
