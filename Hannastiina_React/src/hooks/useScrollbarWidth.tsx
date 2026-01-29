import { useEffect, useRef, useState } from 'react'

export const useScrollbarWidth = () => {
  const didCompute = useRef(false)
  const widthRef = useRef(0)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (didCompute.current) return
    if (typeof document === 'undefined') return

    const outer = document.createElement('div')
    outer.style.visibility = 'hidden'
    outer.style.overflow = 'scroll'
    outer.style.setProperty('msOverflowStyle', 'scrollbar')
    document.body.appendChild(outer)

    const inner = document.createElement('div')
    outer.appendChild(inner)

    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth
    outer.parentNode?.removeChild(outer)

    didCompute.current = true
    widthRef.current = scrollbarWidth
    setWidth(scrollbarWidth)
  }, [])

  return didCompute.current ? widthRef.current : width
}
