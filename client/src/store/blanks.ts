import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { request } from 'utils/request'
import { Validations } from 'utils/validate'

const API_URL = process.env.REACT_APP_API_URL

export type BlankFieldType = 'text' | 'date' | 'group'
export type BlankField = {
  id: number
  name: string
  label: { [key: string]: string } | undefined,
  type: BlankFieldType
  multiple: boolean
  validations?: Validations
  fields?: BlankFields
}
export type BlankFields = BlankField[]
export type Blank = {
  id: number
  name: { [key: string]: string }
  fields: BlankFields
  template: string
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
    set: (state, action) => action.payload,
  },
})

export const { reducer: blanksReducer, actions: blanksActions } = slice
