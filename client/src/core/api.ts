import { store } from 'store'
import { authActions } from 'store/auth'
import { request } from './requests'

const API_URL = process.env.REACT_APP_API_URL

export const api = {
  auth: {
    login: ({ username, password }: { username: string; password: string }) =>
      request
        .withToken({ method: 'POST', url: `${API_URL}/login`, data: { username, password } })
        .then(res => store.dispatch(authActions.set(res.data))),
    refresh: () =>
      request
        .withToken({ url: `${API_URL}/refresh`, data: { refreshToken: store.getState().auth.refreshToken } })
        .then(res => authActions.setTokens(res.data)),
  },
}
