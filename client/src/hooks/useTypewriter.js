import { useState, useEffect, useRef } from 'react';

export const useTypewriter = (text, speed = 100, delay = 0) => {
    const [displayText, setDisplayText] = useState('');
    const [isComplete, setIsComplete] = useState(false);
    const currentIndexRef = useRef(0);
    const hasStartedRef = useRef(false);

    useEffect(() => {
        // Only run once
        if (hasStartedRef.current) return;

        const startTyping = () => {
            hasStartedRef.current = true;

            const typeNextChar = () => {
                if (currentIndexRef.current < text.length) {
                    setDisplayText(text.substring(0, currentIndexRef.current + 1));
                    currentIndexRef.current += 1;
                    setTimeout(typeNextChar, speed);
                } else {
                    setIsComplete(true);
                }
            };

            typeNextChar();
        };

        const delayTimer = setTimeout(startTyping, delay);
        return () => clearTimeout(delayTimer);
    }, []); // Empty dependency array - only run once

    return { displayText, isComplete };
};
