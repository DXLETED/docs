import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { request } from 'core/requests'
import { loadState } from 'utils/localStorage'

const API_URL = process.env.REACT_APP_API_URL

export interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: { userId: string; username: string } | null
}
const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  user: null,
}

export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }: { username: string; password: string }) =>
    await request.withToken({ method: 'POST', url: `${API_URL}/login`, data: { username, password } })
)

const slice = createSlice({
  name: 'auth',
  initialState: loadState('auth') || initialState,
  reducers: {
    set: (state, action) => action.payload,
    setUser: (state, action) => (state.user = action.payload),
    setTokens: (state, action) => {
      state.accessToken = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken
    },
    reset: () => initialState,
  },
  extraReducers: {
    [login.fulfilled.type]: (state, action) => action.payload,
  },
})

export const { reducer: authReducer, actions: authActions } = slice
