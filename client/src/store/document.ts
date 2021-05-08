import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import objectPath from 'object-path'
import { RootState } from 'store'
import { request } from 'utils/request'

const API_URL = process.env.REACT_APP_API_URL

const initialState: any = null

export const sendDocument = createAsyncThunk('document/send', async ({blankId}: {blankId: number}, thunkAPI) => {
  const data = {
    blankId,
    document: (thunkAPI.getState() as RootState).document
  }
  await request.withToken({method: 'POST', url: `${API_URL}/documents`, data}, thunkAPI)
})

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
