import { store } from 'store'
import { authActions } from 'store/auth'
import { requests } from './requests'

const { API_URL } = process.env

export const api = {
  auth: {
    login: ({ username, password }: { username: string; password: string }) =>
      requests.create({ url: `${API_URL}/login`, data: { username, password } })
        .then(res => authActions.set(res.data)),
    refresh: () =>
      requests.create({ url: `${API_URL}/refresh`, data: { refreshToken: store.getState().auth.refreshToken } })
        .then(res => authActions.setTokens(res.data)),
  },
}
