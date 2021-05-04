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
  'auth/set': (state: IAuthState, action: { type: 'auth/set'; data: { accessToken: string | null } }) => ({
    ...state,
    ...action.data,
  }),
}

export const authReducer = reducerFactory(initialState, handlers)
