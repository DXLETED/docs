import { AsyncThunkAction } from '@reduxjs/toolkit'
import { useEffect, useState } from 'react'
import { useDispatchTyped } from './dispatchTyped.hook'

export const useRequest = (req: AsyncThunkAction<any, any, any>) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const dispatch = useDispatchTyped()
  useEffect(() => {
    dispatch(req)
      .then(() => setIsLoaded(true))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return [isLoaded]
}
