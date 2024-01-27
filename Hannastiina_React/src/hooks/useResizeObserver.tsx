import { RefObject, useEffect, useState } from 'react'

function useResizeObserver(ref: RefObject<HTMLUListElement>) {
  const [dimensions, setDimensions] = useState<DOMRectReadOnly | null>(null)

  useEffect(() => {
    if (ref.current) {
      const observer = new ResizeObserver((entries) => {
        for (let entry of entries) {
          setDimensions(entry.contentRect)
        }
      })

      observer.observe(ref.current)

      // Clean up the observer when the component is unmounted
      return () => {
        if (ref.current) {
          observer.unobserve(ref.current)
        }
      }
    }
  }, [ref])

  return dimensions
}
export default useResizeObserver
