import { useEffect, useState } from 'react'

export default function useWindowSize() {
    // SSR-safe: first render must match server HTML
    const [windowSize, setWindowSize] = useState(() => ({
        windowWidth: 0,
        windowHeight: 0,
    }))

    useEffect(() => {
        if (typeof window === 'undefined') return

        const handleResize = () => {
            setWindowSize({ windowWidth: window.innerWidth, windowHeight: window.innerHeight })
        }

        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return windowSize
}