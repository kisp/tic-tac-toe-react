import {useState} from 'react'

function getStorageValue<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key)
    if (stored) {
      return JSON.parse(stored) as T
    }
  } catch {
    // ignore parse errors
  }
  return defaultValue
}

export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() =>
    getStorageValue(key, defaultValue),
  )

  const setStoredValue: React.Dispatch<React.SetStateAction<T>> = action => {
    setValue(prev => {
      const nextValue =
        action instanceof Function ? action(prev) : action
      try {
        localStorage.setItem(key, JSON.stringify(nextValue))
      } catch {
        // ignore storage errors
      }
      return nextValue
    })
  }

  return [value, setStoredValue]
}