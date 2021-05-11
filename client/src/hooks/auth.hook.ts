import { useDispatch } from 'react-redux'
import { authActions, AuthState } from 'store/auth'
import { useSelectorTyped } from './selectorTyped.hook'

interface UseAuthState extends AuthState {
  isAuthorized: boolean
  logout: () => void
}
export const useAuth = (): UseAuthState => {
  const state = useSelectorTyped(s => s.auth)
  const dispatch = useDispatch()
  const logout = () => dispatch(authActions.reset())
  return { ...state, isAuthorized: !!state.user, logout }
}
