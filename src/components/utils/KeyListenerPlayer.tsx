import { useEffect } from "react";

export const KeyListenerPlayer = (key: string, action: () => void) => {
    const checkInputText = () => !(document.activeElement instanceof HTMLInputElement);

    useEffect(() => {
        const keyManipulator = (event: KeyboardEvent) => {
            if (event.key.toLocaleUpperCase() === key.toLocaleUpperCase())
                if (checkInputText())
                    action();
        };

        window.addEventListener('keydown', keyManipulator);

        return () => window.removeEventListener('keydown', keyManipulator);
    }, []);
}