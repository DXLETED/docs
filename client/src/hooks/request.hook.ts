import { AsyncThunkAction } from '@reduxjs/toolkit'
import { useEffect, useState } from 'react'
import { RootState } from 'store'
import { useDispatchTyped } from './dispatchTyped.hook'
import { useSelectorTyped } from './selectorTyped.hook'

export const useRequest = <T>(
  selector: (state: RootState) => T,
  req: () => AsyncThunkAction<any, any, any>
): [T, string, any] => {
  const data = useSelectorTyped(selector)
  const [status, setStatus] = useState<'loading' | 'fulfilled' | 'error'>('loading')
  const [error, setError] = useState(null)
  const dispatch = useDispatchTyped()
  useEffect(() => {
    dispatch(req()).then(res => {
      if (res.meta.requestStatus === 'fulfilled')
        setStatus('fulfilled')
      else {
        setError((res as any).error.message)
        setStatus('error')
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return [data, status, error]
}
