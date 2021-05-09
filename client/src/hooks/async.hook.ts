import { useEffect } from 'react'

export const useAsync = <T>(asyncFn: () => Promise<T>, onSuccess: (data: T) => void) => {
  useEffect(() => {
    let isMounted = true
    asyncFn().then(data => isMounted && onSuccess(data))
    return () => {
      isMounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
