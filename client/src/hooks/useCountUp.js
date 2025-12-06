import { useEffect, useRef } from 'react';

export const useCountUp = (end, duration = 1000) => {
    const nodeRef = useRef();

    useEffect(() => {
        if (!nodeRef.current || !end) return;

        let startTime;
        const startValue = 0;
        const endValue = parseFloat(end);

        const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);

            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = startValue + (endValue - startValue) * easeOutQuart;

            if (nodeRef.current) {
                nodeRef.current.textContent = Math.round(current).toLocaleString();
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [end, duration]);

    return nodeRef;
};
