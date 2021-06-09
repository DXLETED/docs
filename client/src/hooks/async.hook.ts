import { useEffect } from 'react'

export const useAsync = <T>(asyncFn: () => Promise<T>, onSuccess: (data: T) => void, deps: any[]) => {
  useEffect(() => {
    let isMounted = true
    asyncFn().then(data => isMounted && onSuccess(data))
    return () => {
      isMounted = false
    }
  }, deps)
}
