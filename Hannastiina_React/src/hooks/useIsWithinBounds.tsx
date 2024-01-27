import { useEffect, useState } from 'react'

function useIsWithinBounds(
  ref: React.RefObject<HTMLElement>,
  containerRef: React.RefObject<HTMLElement>
) {
  const [isWithinBounds, setIsWithinBounds] = useState(false)

  useEffect(() => {
    function checkBounds() {
      if (ref.current && containerRef.current) {
        const rect = ref.current.getBoundingClientRect()
        const containerRect = {
          top: containerRef.current.offsetTop,
          left: containerRef.current.offsetLeft,
          right: containerRef.current.offsetLeft + containerRef.current.offsetWidth,
          bottom: containerRef.current.offsetTop + containerRef.current.scrollHeight,
        }

        setIsWithinBounds(
          rect.top >= containerRect.top &&
            rect.right <= containerRect.right &&
            rect.bottom <= containerRect.bottom &&
            rect.left >= containerRect.left
        )
      }
    }

    checkBounds()

    // Check bounds again whenever the window is resized
    window.addEventListener('resize', checkBounds)

    // Clean up the event listener when the component is unmounted
    return () => window.removeEventListener('resize', checkBounds)
  }, [ref, containerRef])

  return isWithinBounds
}

export default useIsWithinBounds
