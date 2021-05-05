import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { authReducer } from './auth'

export const store = configureStore({ reducer: combineReducers({ auth: authReducer }) })

export type RootState = ReturnType<typeof store.getState>
