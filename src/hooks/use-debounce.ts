import { useState, useEffect } from 'react';

/**
 * Hook to debounce a value
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 1000ms)
 */
export function useDebounce<T>(value: T, delay: number = 1000): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        // Set up the timeout
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Clean up the timeout if value changes before delay
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}
