import { AsyncThunkAction } from '@reduxjs/toolkit'
import { useEffect, useState } from 'react'
import { RootState } from 'store'
import { useDispatchTyped } from './dispatchTyped.hook'
import { useSelectorTyped } from './selectorTyped.hook'

export const useRequest = <T>(
  selector: (state: RootState) => T,
  req: () => AsyncThunkAction<any, any, any>
): [T, boolean] => {
  const data = useSelectorTyped(selector)
  const [isLoaded, setIsLoaded] = useState(false)
  const dispatch = useDispatchTyped()
  useEffect(() => {
    dispatch(req()).then(() => setIsLoaded(true))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return [data, isLoaded]
}
