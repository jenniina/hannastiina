import { RefObject, useEffect, useRef, useState } from 'react'

interface Args extends IntersectionObserverInit {
  freezeOnceVisible?: boolean
}

function useIntersectionObserver<T extends HTMLElement = HTMLElement>(
  elementRef: RefObject<T>,
  { threshold = 0, root = null, rootMargin = '0%', freezeOnceVisible = false }: Args
): IntersectionObserverEntry | undefined {
  const [entry, setEntry] = useState<IntersectionObserverEntry>()

  const frozen = useRef(false)

  const updateEntry = ([entry]: IntersectionObserverEntry[]): void => {
    setEntry(entry)

    if (freezeOnceVisible && entry.isIntersecting) {
      frozen.current = true
    }
  }

  //   useEffect(() => {
  //     const node = elementRef?.current // DOM Ref
  //     const hasIOSupport = !!window.IntersectionObserver

  //     if (!hasIOSupport || frozen.current || !node) return

  //     const observerParams = { threshold, root, rootMargin }
  //     const observer = new IntersectionObserver(updateEntry, observerParams)

  //     observer.observe(node)

  //     return () => observer.disconnect()

  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, [elementRef, threshold, root, rootMargin, freezeOnceVisible])

  useEffect(() => {
    const node = elementRef?.current // DOM Ref
    const hasIOSupport = !!window.IntersectionObserver

    if (!hasIOSupport) {
      // Fallback behavior goes here
      // For example, you could call `setEntry` with a mock entry
      setEntry({
        time: Date.now(),
        target: node as T,
        isIntersecting: true,
        intersectionRatio: 1,
        boundingClientRect: node?.getBoundingClientRect() || new DOMRect(),
        rootBounds: (node?.getRootNode() as T).getBoundingClientRect() || new DOMRect(),
        intersectionRect: node?.getBoundingClientRect() || new DOMRect(),
      })
      return
    }

    if (frozen.current || !node) return

    const observerParams = { threshold, root, rootMargin }
    const observer = new IntersectionObserver(updateEntry, observerParams)

    observer.observe(node)

    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elementRef, threshold, root, rootMargin, freezeOnceVisible])

  return entry
}

export default useIntersectionObserver
