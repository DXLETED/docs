import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { request } from 'utils/request'

const API_URL = process.env.REACT_APP_API_URL

type Validation = 'required' | 'notContainWhiteSpaces' | 'email' | 'phone' | 'notContainNumbers'
export type Field = {
  id: number
  name: string
  label: string
  type: 'text' | 'date' | 'group'
  multiple: boolean
  validations?: Validation[]
  fields?: Field[]
}
export type Blank = {
  id: number
  name: string
  fields: Field[]
}
export type BlanksState = Blank[]

const initialState: BlanksState = []

export const getBlanks = createAsyncThunk('blanks/get', async (_, thunkAPI) => {
  const res = await request.withToken({ url: `${API_URL}/blanks` }, thunkAPI)
  thunkAPI.dispatch(slice.actions.set(res))
  return res
})

const slice = createSlice({
  name: 'blanks',
  initialState,
  reducers: {
    set: (statte, action) => action.payload,
  },
})

export const { reducer: blanksReducer, actions: blanksActions } = slice
