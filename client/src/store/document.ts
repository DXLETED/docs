import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import objectPath from 'object-path'
import { RootState } from 'store'
import { request } from 'utils/request'
import { Blank, BlankField, BlankFieldType } from './blanks'

const API_URL = process.env.REACT_APP_API_URL

export type DocumentPath = (string | number)[]

export interface DocumentState {
  showErrors: boolean
  document: {
    blankId: number | null
    title: string
    description: string
    data: any
  }
}
const initialState: DocumentState = {
  showErrors: false,
  document: {
    blankId: null,
    title: '',
    description: '',
    data: null,
  }
}

export const sendDocument = createAsyncThunk('document/send', async (_, thunkAPI) => {
  const data = (thunkAPI.getState() as RootState).document
  await request.withToken({ method: 'POST', url: `${API_URL}/documents`, data }, thunkAPI)
})

const dataFields: { [key in BlankFieldType]: any } = {
  text: '',
  date: null,
  group: {},
}
export const fieldData = (field: BlankField) => dataFields[field.type]
const dataFromBlank = (blank: Blank) =>
  Object.fromEntries(blank.fields.map(el => [el.name, el.multiple ? [] : fieldData(el)]))

const slice = createSlice({
  name: 'document',
  initialState,
  reducers: {
    init: (state, action) => {
      if (action.payload.blank) {
        state.document.blankId = action.payload.blank.id
        state.document.data = dataFromBlank(action.payload.blank)
      } else {
        state.document.blankId = null
        state.document.data = null
      }
    },
    clear: (state, action) => initialState,
    update: (state, action) => {
      objectPath.set(state.document.data, action.payload.path, action.payload.value)
    },
    push: (state, action) => {
      objectPath.push(state.document.data, action.payload.path, action.payload.value)
    },
    remove: (state, action) => {
      objectPath.del(state.document.data, action.payload.path)
    },
    setTitle: (state, action) => {
      state.document.title = action.payload
    },
    setDescription: (state, action) => {
      state.document.description = action.payload
    },
    showErrors: (state, action) => {
      state.showErrors = true
    }
  },
})

export const { reducer: documentReducer, actions: documentActions } = slice
