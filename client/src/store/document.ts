import { createSlice } from '@reduxjs/toolkit'
import objectPath from 'object-path'

const initialState: any = null

const slice = createSlice({
  name: 'document',
  initialState,
  reducers: {
    init: (state, action) => action.payload,
    update: (state, action) => {
      objectPath.set(state, action.payload.path ? [action.payload.path, action.payload.field] : action.payload.field, action.payload.value)
      return state
    }
  },
})

export const { reducer: documentReducer, actions: documentActions } = slice
