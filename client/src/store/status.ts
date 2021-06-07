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
  subscribed: boolean | 'loading'
  notifications: UserNotification[]
  myDocuments: number | null
  newDocuments: number | null
}

const initialState: StatusState = {
  subscribed: 'loading',
  notifications: [],
  myDocuments: null,
  newDocuments: null,
}

export const getStatus = createAsyncThunk('status/get', async (_, thunkAPI) => {
  thunkAPI.dispatch(
    slice.actions.setSubscribeStatus(
      !!(await navigator.serviceWorker.getRegistrations()).length && window.Notification.permission === 'granted'
    )
  )
  const res = await request.withToken({ url: `${process.env.REACT_APP_API_URL}/status` }, thunkAPI)
  thunkAPI.dispatch(slice.actions.set(res))
  return res
})

export const subscribe = createAsyncThunk('webpush/subscribe', async (_, thunkAPI) => {
  thunkAPI.dispatch(slice.actions.setSubscribeStatus('loading'))
  const register = await navigator.serviceWorker.register('sw.js', { scope: '/' })
  const subscription = await register.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(process.env.REACT_APP_PUBLIC_VAPID_KEY as string),
  })
  await request
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
  thunkAPI.dispatch(slice.actions.setSubscribeStatus(true))
})

export const unsubscribe = createAsyncThunk('webpush/subscribe', async (_, thunkAPI) => {
  thunkAPI.dispatch(slice.actions.setSubscribeStatus('loading'))
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
  thunkAPI.dispatch(slice.actions.setSubscribeStatus(false))
})

const slice = createSlice({
  name: 'status',
  initialState,
  reducers: {
    set: (state, action) => ({ ...state, ...action.payload }),
    setSubscribeStatus: (state, action) => {
      state.subscribed = action.payload
    },
  },
})

export const { reducer: statusReducer, actions: statusActions } = slice
