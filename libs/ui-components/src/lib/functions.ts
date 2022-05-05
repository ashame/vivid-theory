import { useEffect, useRef } from 'react';

export const getRandomColors = () => {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    const a = Math.random() * 0.5 + 0.5;
    return [`rgb(${r}, ${g}, ${b})`, `rgba(${r}, ${g}, ${b}, ${a})`];
};

export function usePrevious<T>(value: T): T | undefined {
    const ref = useRef<T>();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}
