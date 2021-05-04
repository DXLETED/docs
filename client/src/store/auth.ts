import { reducerFactory } from 'utils/reducerFactory'

export interface IAuthState {
  accessToken: string | null
  refreshToken: string | null
  user: { userId: string; username: string } | null
}
const initialState: IAuthState = {
  accessToken: null,
  refreshToken: null,
  user: null,
}

const handlers = {
  'auth/set': (state: IAuthState, action: { type: 'auth/set'; data: IAuthState }) => ({
    ...state,
    ...action.data,
  }),
  'auth/set/tokens': (
    state: IAuthState,
    action: { type: 'auth/set/tokens'; data: { accessToken: string | null; refreshToken: string | null } }
  ) => ({
    ...state,
    accessToken: action.data.accessToken,
    refreshToken: action.data.refreshToken,
  }),
  'auth/reset': (state: IAuthState, action: { type: 'auth/reset' }) => ({
    ...state,
    ...initialState,
  }),
}

export const authReducer = reducerFactory(initialState, handlers)
