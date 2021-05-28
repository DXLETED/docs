import { combineReducers, configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { saveState } from 'utils/localStorage'
import { authReducer } from './auth'
import { blanksReducer } from './blanks'
import { documentReducer } from './document'
import { documentCreateReducer } from './documentCreate'
import { documentsReducer } from './documents'
import { notificationsReducer } from './notifications'
import { switchesReducer } from './switches'
import { usersReducer } from './users'

export const store = configureStore({
  reducer: combineReducers({
    auth: authReducer,
    blanks: blanksReducer,
    document: documentReducer,
    documentCreate: documentCreateReducer,
    documents: documentsReducer,
    switches: switchesReducer,
    users: usersReducer,
    notifications: notificationsReducer,
  }),
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActionPaths: ['payload.file'],
    },
  }),
})

export type RootState = ReturnType<typeof store.getState>
export type RootDispatch = typeof store.dispatch

store.subscribe(() => saveState('auth', store.getState().auth))
