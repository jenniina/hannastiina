import { useCallback, useState, useEffect } from 'react'

// type ReturnType<T> = [
//     T | undefined,
//     React.Dispatch<React.SetStateAction<T | undefined>>,
//     () => void
// ]
type ReturnType<T> = [T, React.Dispatch<React.SetStateAction<T>>, () => void]

export default function useLocalStorage<T>(key: string, defaultValue: T) {
  return useStorage(key, defaultValue, window.localStorage)
}

export function useSessionStorage<T>(key: string, defaultValue: T) {
  return useStorage(key, defaultValue, window.sessionStorage)
}

function useStorage<T>(
  key: string,
  defaultValue: T,
  storageObject: Storage
): ReturnType<T> {
  const [value, setValue] = useState<T>(() => {
    const jsonValue = storageObject.getItem(key)
    if (jsonValue != null) return JSON.parse(jsonValue)

    if (typeof defaultValue === 'function') {
      return defaultValue()
    } else {
      return defaultValue
    }
  })

  useEffect(() => {
    if (value === undefined) return storageObject.removeItem(key)
    storageObject.setItem(key, JSON.stringify(value))
  }, [key, value, storageObject])

  const remove = useCallback(() => {
    return storageObject.removeItem(key)
  }, [])

  return [value, setValue, remove]
}
