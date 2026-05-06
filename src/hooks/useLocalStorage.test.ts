import {renderHook, act} from '@testing-library/react'
import {describe} from 'vitest'
import {useLocalStorage} from './useLocalStorage.ts'

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns the default value when localStorage is empty', () => {
    const {result} = renderHook(() =>
      useLocalStorage('testKey', 'defaultValue'),
    )
    expect(result.current[0]).toEqual('defaultValue')
  })

  it('returns the stored value when localStorage has data', () => {
    localStorage.setItem('testKey', JSON.stringify('storedValue'))
    const {result} = renderHook(() =>
      useLocalStorage('testKey', 'defaultValue'),
    )
    expect(result.current[0]).toEqual('storedValue')
  })

  it('updates the value and persists to localStorage', () => {
    const {result} = renderHook(() => useLocalStorage<string[]>('testKey', []))

    act(() => {
      result.current[1](['item1', 'item2'])
    })

    expect(result.current[0]).toEqual(['item1', 'item2'])
    expect(JSON.parse(localStorage.getItem('testKey')!)).toEqual([
      'item1',
      'item2',
    ])
  })

  it('supports functional updates', () => {
    const {result} = renderHook(() => useLocalStorage<string[]>('testKey', []))

    act(() => {
      result.current[1](prev => [...prev, 'item1'])
    })

    act(() => {
      result.current[1](prev => [...prev, 'item2'])
    })

    expect(result.current[0]).toEqual(['item1', 'item2'])
    expect(JSON.parse(localStorage.getItem('testKey')!)).toEqual([
      'item1',
      'item2',
    ])
  })

  it('handles invalid JSON in localStorage gracefully', () => {
    localStorage.setItem('testKey', 'not-json')
    const {result} = renderHook(() =>
      useLocalStorage('testKey', 'defaultValue'),
    )
    expect(result.current[0]).toEqual('defaultValue')
  })

  it('can clear the value by setting to an empty array', () => {
    localStorage.setItem('testKey', JSON.stringify(['a', 'b']))
    const {result} = renderHook(() => useLocalStorage<string[]>('testKey', []))

    act(() => {
      result.current[1]([])
    })

    expect(result.current[0]).toEqual([])
    expect(JSON.parse(localStorage.getItem('testKey')!)).toEqual([])
  })
})
