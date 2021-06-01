import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { request } from 'utils/request'

export type UserNotificationType = 'CREATE' | 'SIGN' | 'REJECT' | 'ARCHIVE'
export type UserNotification = {
  type: UserNotificationType
  userId: string
  document: {
    id: string
    title: string
  }
  date: Date
}

interface StatusState {
  notifications: UserNotification[]
  myDocuments: number | null
  newDocuments: number | null
}

const initialState: StatusState = {
  notifications: [],
  myDocuments: null,
  newDocuments: null,
}

export const getStatus = createAsyncThunk('status/get', async (_, thunkAPI) => {
  const res = await request.withToken({ url: `${process.env.REACT_APP_API_URL}/status` }, thunkAPI)
  thunkAPI.dispatch(slice.actions.set(res))
  return res
})

const slice = createSlice({
  name: 'status',
  initialState,
  reducers: {
    set: (state, action) => action.payload,
  },
})

export const { reducer: statusReducer, actions: statusActions } = slice
