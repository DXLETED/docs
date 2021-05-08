import { createSlice } from '@reduxjs/toolkit'
import objectPath from 'object-path'

const initialState: any = null

const slice = createSlice({
  name: 'document',
  initialState,
  reducers: {
    init: (state, action) => action.payload,
    update: (state, action) => {
      objectPath.set(state, action.payload.path, action.payload.value)
      return state
    },
    push: (state, action) => {
      objectPath.push(state, action.payload.path, action.payload.value)
      return state
    },
    remove: (state, action) => {
      objectPath.del(state, action.payload.path)
      return state
    }
  },
})

export const { reducer: documentReducer, actions: documentActions } = slice
