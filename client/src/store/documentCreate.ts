import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import objectPath from 'object-path'
import { RootState } from 'store'
import { reorder } from 'utils/reorder'
import { request } from 'utils/request'
import { Blank, BlankField, BlankFieldType } from './blanks'

const API_URL = process.env.REACT_APP_API_URL

export type DocumentPath = (string | number)[]

export interface DocumentCreateState {
  showErrors: boolean
  document: {
    blankId: number | null
    title: string
    description: string
    signers: string[]
    data: any
  }
}
const initialState: DocumentCreateState = {
  showErrors: false,
  document: {
    blankId: null,
    title: '',
    description: '',
    signers: [],
    data: null,
  },
}

export const sendDocument = createAsyncThunk('document/send', async (_, thunkAPI) => {
  const data = (thunkAPI.getState() as RootState).documentCreate.document
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
  name: 'documentCreate',
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
    },
    addSigner: (state, action) => {
      state.document.signers.push(action.payload.userId)
    },
    delSigner: (state, action) => {
      state.document.signers = state.document.signers.filter(u => u !== action.payload.userId)
    },
    moveSigner: (state, action) => {
      state.document.signers = reorder(state.document.signers, action.payload.prev, action.payload.new)
    },
  },
})

export const { reducer: documentCreateReducer, actions: documentCreateActions } = slice
