import { useSelector } from 'react-redux'
import { RootState } from 'store'

export const useSelectorTyped = <T>(selector: (state: RootState) => T): T => useSelector(selector)
