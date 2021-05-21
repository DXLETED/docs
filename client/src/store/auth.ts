import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { request } from 'utils/request'
import { loadState } from 'utils/localStorage'

const API_URL = process.env.REACT_APP_API_URL

export type AuthState = {
  accessToken: string | null
  refreshToken: string | null
  user: { userId: string; username: string } | null
}
const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  user: null,
}

export interface LoginPayload {
  username: string
  password: string
}
export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }: { username: string; password: string }, thunkAPI) => {
    const res = await request.withoutToken(
      { method: 'POST', url: `${API_URL}/auth/login`, data: { username, password } },
      thunkAPI
    )
    thunkAPI.dispatch(slice.actions.set(res))
    return res
  }
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
})

export const { reducer: authReducer, actions: authActions } = slice
