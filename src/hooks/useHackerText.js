import { useState, useEffect, useRef } from 'react';

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";

export function useHackerText(originalText) {
    const [text, setText] = useState(originalText);
    const intervalRef = useRef(null);

    const triggerScramble = () => {
        let iterations = 0;
        
        clearInterval(intervalRef.current);
        
        intervalRef.current = setInterval(() => {
            setText(originalText.split("")
                .map((letter, index) => {
                    if (index < iterations) {
                        return originalText[index];
                    }
                    return CHARS[Math.floor(Math.random() * CHARS.length)];
                })
                .join("")
            );
            
            if (iterations >= originalText.length) {
                clearInterval(intervalRef.current);
            }
            
            iterations += 1 / 3;
        }, 30);
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => clearInterval(intervalRef.current);
    }, []);

    return { text, triggerScramble };
}
