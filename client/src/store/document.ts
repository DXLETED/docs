import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { request } from 'utils/request'
import dict from 'dictionary.json'

export type Document = {
  _id: string
  userId: string
  title: string
  description: string
  status: keyof typeof dict.documentStatus
  signers: string[]
  data: any
  createdAt: Date
  updatedAt: Date
}

type DocumentState = Document | null

const initialState: DocumentState = null as DocumentState

export const getDocument = createAsyncThunk('document/get', async ({ id }: { id: string }, thunkAPI) => {
  const res = await request.withToken(
    { method: 'GET', url: `${process.env.REACT_APP_API_URL}/documents/${id}` },
    thunkAPI
  )
  thunkAPI.dispatch(slice.actions.set(res))
  return res
})

const slice = createSlice({
  name: 'document',
  initialState,
  reducers: {
    set: (state, action) => action.payload,
  },
})

export const { reducer: documentReducer, actions: documentActions } = slice
