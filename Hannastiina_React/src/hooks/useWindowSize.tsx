import { useState, useEffect } from 'react';

function getWindowSize() {
    const { innerWidth: windowWidth, innerHeight: windowHeight } = window;
    return {
        windowWidth,
        windowHeight
    };
}

export default function useWindowSize() {
    const [windowSize, setWindowSize] = useState(getWindowSize());

    useEffect(() => {
        function handleResize() {
            setWindowSize(getWindowSize());
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowSize;
}