import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { authActions, IAuthState } from 'store/auth'

interface IUseAuthR extends IAuthState { isAuthorized: boolean, logout: () => void }
export const useAuth = (): IUseAuthR => {
  const state = useSelector((s: RootState) => s.auth)
  const dispatch = useDispatch()
  const logout = () => dispatch(authActions.reset())
  return { ...state, isAuthorized: !!state.user, logout }
}
