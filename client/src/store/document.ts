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
  signers: { userId: string; status: keyof typeof dict.signerStatus; rejectReason?: string; updatedAt: Date }[]
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

export const resolveDocument = createAsyncThunk(
  'document/resolve',
  async ({ password }: { password: string }, thunkAPI) => {
    const id = (thunkAPI.getState() as RootState).document?._id
    return await request.withToken(
      { method: 'POST', url: `${process.env.REACT_APP_API_URL}/documents/${id}/resolve`, data: { password } },
      thunkAPI
    )
  }
)

export const rejectDocument = createAsyncThunk(
  'document/reject',
  async ({ rejectReason, password }: { rejectReason: string; password: string }, thunkAPI) => {
    const id = (thunkAPI.getState() as RootState).document?._id
    return await request.withToken(
      { method: 'POST', url: `${process.env.REACT_APP_API_URL}/documents/${id}/reject`, data: { rejectReason, password } },
      thunkAPI
    )
  }
)

export const archiveDocument = createAsyncThunk('document/archive', async (_, thunkAPI) => {
  const id = (thunkAPI.getState() as RootState).document?._id
  return await request.withToken(
    { method: 'POST', url: `${process.env.REACT_APP_API_URL}/documents/${id}/archive` },
    thunkAPI
  )
})

const slice = createSlice({
  name: 'document',
  initialState,
  reducers: {
    set: (state, action) => action.payload,
  },
})

export const { reducer: documentReducer, actions: documentActions } = slice
