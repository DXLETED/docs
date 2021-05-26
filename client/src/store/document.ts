import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { request } from 'utils/request'
import dict from 'dictionary.json'
import { RootState } from 'store'

export type Document = {
  _id: string
  userId: string
  title: string
  description: string
  status: keyof typeof dict.documentStatus
  signers: string[]
  data: any
  rawDocument: string
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

export const getPDF = createAsyncThunk('document/get/pdf', async (_, thunkAPI) => {
  const id = (thunkAPI.getState() as RootState).document?._id
  return {
    file: await request.withToken(
      { method: 'GET', url: `${process.env.REACT_APP_API_URL}/documents/${id}/pdf`, responseType: 'blob' },
      thunkAPI
    ),
  }
})

const slice = createSlice({
  name: 'document',
  initialState,
  reducers: {
    set: (state, action) => action.payload,
  },
})

export const { reducer: documentReducer, actions: documentActions } = slice
