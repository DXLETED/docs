import React, { useEffect } from 'react'

export const useOnClickOutside = <T extends Node>(ref: React.MutableRefObject<T>, handler: (e: MouseEvent) => void) => {
  useEffect(() => {
    const onClick = (e: MouseEvent) =>
      ref.current && e.target instanceof Node && !ref.current.contains(e.target) && handler(e)
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [ref, handler])
}
