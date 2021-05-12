import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { saveState } from 'utils/localStorage'
import { authReducer } from './auth'
import { blanksReducer } from './blanks'
import { documentReducer } from './document'
import { switchesReducer } from './switches'
import { tableSettingsReducer } from './tableSettings'

export const store = configureStore({
  reducer: combineReducers({
    auth: authReducer,
    blanks: blanksReducer,
    document: documentReducer,
    switches: switchesReducer,
    tableSettings: tableSettingsReducer,
  }),
})

export type RootState = ReturnType<typeof store.getState>
export type RootDispatch = typeof store.dispatch

store.subscribe(() => saveState('auth', store.getState().auth))
store.subscribe(() => saveState('tableSettings', store.getState().tableSettings))
