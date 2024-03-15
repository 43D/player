import { useEffect } from "react";

export const KeyListenerPlayer = (key: string, action: () => void) => {
    useEffect(() => {
        const keyManipulator = (event: KeyboardEvent) => {
            event.preventDefault();
            if (event.key.toLocaleUpperCase() === key.toLocaleUpperCase())
                action();
        };

        window.addEventListener('keydown', keyManipulator);

        return () => window.removeEventListener('keydown', keyManipulator);
    }, []);
}