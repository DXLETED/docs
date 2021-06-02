import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { notifyApiError } from 'utils/apiError'
import { request } from 'utils/request'
import { urlBase64ToUint8Array } from 'utils/urlBase64ToUint8Array'

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

export const subscribe = createAsyncThunk('webpush/subscribe', async (_, thunkAPI) => {
  const register = await navigator.serviceWorker.register('sw.js', { scope: '/' })
  const subscription = await register.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(process.env.REACT_APP_PUBLIC_VAPID_KEY as string),
  })
  request
    .withToken(
      {
        url: `${process.env.REACT_APP_API_URL}/notifications/subscribe`,
        data: subscription,
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      },
      thunkAPI
    )
    .catch(notifyApiError)
})

export const unsubscribe = createAsyncThunk('webpush/subscribe', async (_, thunkAPI) => {
  const register = (await navigator.serviceWorker.getRegistrations())[0]
  await register?.unregister()
  request
    .withToken(
      {
        url: `${process.env.REACT_APP_API_URL}/notifications/unsubscribe`,
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      },
      thunkAPI
    )
    .catch(notifyApiError)
})

const slice = createSlice({
  name: 'status',
  initialState,
  reducers: {
    set: (state, action) => action.payload,
  },
})

export const { reducer: statusReducer, actions: statusActions } = slice
