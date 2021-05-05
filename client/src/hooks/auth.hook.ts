import { useSelector } from 'react-redux'
import { RootState } from 'store'
import { IAuthState } from 'store/auth'

interface IUseAuthR extends IAuthState { isAuthorized: boolean }
export const useAuth = (): IUseAuthR => {
  const state = useSelector((s: RootState) => s.auth)
  return { ...state, isAuthorized: !!state.user }
}
