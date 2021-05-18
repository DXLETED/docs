import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { request } from 'utils/request'

const API_URL = process.env.REACT_APP_API_URL

export type User = {
  userId: string
  username: string
}
const initialState: User[] = []

export const getUsers = createAsyncThunk('users/get', async (_, thunkAPI) => {
  const res = await request.withToken({ url: `${API_URL}/users` }, thunkAPI)
  thunkAPI.dispatch(slice.actions.set(res))
  return res
})

const slice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    set: (state, action) => action.payload,
  },
})

export const { reducer: usersReducer, actions: usersActions } = slice
