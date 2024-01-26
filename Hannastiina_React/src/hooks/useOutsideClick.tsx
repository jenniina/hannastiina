import { useCallback, useEffect, useMemo, useRef } from 'react'

interface Props {
  onOutsideClick: (e: Event) => void
  allowAnyKey?: boolean
  triggerKeys?: string[]
}
//https://www.npmjs.com/package/react-detect-click-outside
type EventConfigItem = [
  string,
  (
    | ((e: Event) => void)
    | ((e: Event | MouseEvent | TouchEvent) => void)
    | ((e: Event | KeyboardEvent) => void)
  )
]

/**
 * Hook used to detect clicks outside a component (or an escape key press). onOutsideClick function is triggered on `click`, `touch` or escape `keyup` event.
 *
 */
export function useOutsideClick({ onOutsideClick, allowAnyKey, triggerKeys }: Props) {
  const ref = useRef(null)

  const keyListener = useCallback(
    (e: KeyboardEvent) => {
      if (allowAnyKey) {
        onOutsideClick(e)
      } else if (triggerKeys) {
        if (triggerKeys.includes(e.key)) {
          onOutsideClick(e)
        }
      } else {
        if (e.key === 'Escape') {
          onOutsideClick(e)
        }
      }
    },
    [allowAnyKey, triggerKeys, onOutsideClick]
  )

  const clickOrTouchListener = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (ref && ref.current) {
        if (!(ref.current as HTMLElement)?.contains(e.target as HTMLElement)) {
          onOutsideClick?.(e)
        }
      }
    },
    [ref.current, onOutsideClick]
  )

  const eventsConfig = useMemo(
    () => [
      ['click', clickOrTouchListener] as EventConfigItem,
      ['touchstart', clickOrTouchListener] as EventConfigItem,
      ['keyup', keyListener] as EventConfigItem,
    ],
    [clickOrTouchListener, keyListener]
  )

  useEffect(() => {
    eventsConfig.map((eventConfigItem) => {
      const [eventName, listener] = eventConfigItem

      document.addEventListener(eventName, listener)
    })

    return () => {
      eventsConfig?.map((eventConfigItem) => {
        const [eventName, listener] = eventConfigItem

        document.removeEventListener(eventName, listener)
      })
    }
  }, [eventsConfig])

  return ref
}
