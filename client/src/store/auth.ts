import { createSlice } from '@reduxjs/toolkit'

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

const slice = createSlice({
  name: 'auth',
  initialState,
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
