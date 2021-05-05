import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { saveState } from 'utils/localStorage'
import { authReducer } from './auth'

export const store = configureStore({ reducer: combineReducers({ auth: authReducer }) })

export type RootState = ReturnType<typeof store.getState>

store.subscribe(() => saveState('auth', store.getState().auth))
