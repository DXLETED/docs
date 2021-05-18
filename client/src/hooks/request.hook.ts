import { AsyncThunkAction } from '@reduxjs/toolkit'
import { useState } from 'react'
import { RootState } from 'store'
import { useDispatchTyped } from './dispatchTyped.hook'
import { useSelectorTyped } from './selectorTyped.hook'
import { useAsync } from './async.hook'
import { RequestStatus } from 'utils/requestsStatus'

export const useRequest = <T>(
  selector: (state: RootState) => T,
  req: () => AsyncThunkAction<any, any, any>
): [T, RequestStatus, any] => {
  const data = useSelectorTyped(selector)
  const [status, setStatus] = useState<RequestStatus>('loading')
  const [error, setError] = useState(null)
  const dispatch = useDispatchTyped()
  useAsync(
    () => dispatch(req()),
    res => {
      if (res.meta.requestStatus === 'fulfilled') setStatus('done')
      else {
        setError((res as any).error.message)
        setStatus('error')
      }
    }
  )
  return [data, status, error]
}
