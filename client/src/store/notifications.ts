import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuid } from 'uuid'

export type NotificationType = 'info' | 'success' | 'warning' | 'error'

export type NotificationData = {
  title?: string
  content?: string
}

export interface Notification extends NotificationData {
  id: string
  type: NotificationType
}

const initialState: Notification[] = []

const slice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    create: (state, action) => {
      state.push({ id: uuid(), ...action.payload })
    },
    close: (state, action) => state.filter(ntf => ntf.id !== action.payload),
  },
})

export const { reducer: notificationsReducer, actions: notificationsActions } = slice
