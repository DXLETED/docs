import { useDispatch } from 'react-redux'
import { RootDispatch } from 'store'

export const useDispatchTyped = () => useDispatch<RootDispatch>()
