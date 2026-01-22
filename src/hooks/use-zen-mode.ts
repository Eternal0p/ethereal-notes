import { useState, useEffect } from 'react';

export function useZenMode() {
    const [isZenMode, setIsZenMode] = useState(false);

    // Load preference from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('zenMode');
        if (saved === 'true') {
            setIsZenMode(true);
        }
    }, []);

    // Listen for keyboard shortcut (Ctrl+\ or Cmd+\)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === '\\') {
                e.preventDefault();
                toggleZenMode();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isZenMode]);

    const toggleZenMode = () => {
        setIsZenMode((prev) => {
            const newValue = !prev;
            localStorage.setItem('zenMode', String(newValue));
            return newValue;
        });
    };

    const enableZenMode = () => {
        setIsZenMode(true);
        localStorage.setItem('zenMode', 'true');
    };

    const disableZenMode = () => {
        setIsZenMode(false);
        localStorage.setItem('zenMode', 'false');
    };

    return {
        isZenMode,
        toggleZenMode,
        enableZenMode,
        disableZenMode,
    };
}
