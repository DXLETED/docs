import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import objectPath from 'object-path'
import faker from 'faker'
import moment from 'moment'
import { RootState } from 'store'
import { reorder } from 'utils/reorder'
import { request } from 'utils/request'
import { Blank, BlankField, BlankFields, BlankFieldType } from './blanks'
import { notify } from 'utils/notify'
import { notifyApiError } from 'utils/apiError'

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

const parseEl: { [key in BlankFieldType]: (d: any, fields?: BlankFields) => any } = {
  text: d => d,
  date: d => moment(d).format('YYYY-MM-DD'),
  group: (d, fields) => parse(fields as BlankFields, d),
}
const parse = (fields: BlankFields, data: any): any =>
  Object.fromEntries(
    Object.values(fields).map(field => [
      field.name,
      field.multiple
        ? data[field.name].map((el: any) => parseEl[field.type](el, field.fields))
        : parseEl[field.type](data[field.name], field.fields),
    ])
  )

export const sendDocument = createAsyncThunk('document/send', async ({ blank }: { blank: Blank }, thunkAPI) => {
  const data = parse(blank.fields, (thunkAPI.getState() as RootState).documentCreate.document.data)
  return await request
    .withToken(
      {
        method: 'POST',
        url: `${API_URL}/documents`,
        data: { ...(thunkAPI.getState() as RootState).documentCreate.document, data },
      },
      thunkAPI
    )
    .then(res => {
      notify.success({ content: 'Документ создан' })
      return res
    })
    .catch(notifyApiError)
})

const dataFields: { [key in BlankFieldType]: any } = {
  text: '',
  date: null,
  group: {},
}
export const fieldData = (field: BlankField) => dataFields[field.type]
const dataFromBlank = (blank: Blank) =>
  Object.fromEntries(blank.fields.map(el => [el.name, el.multiple ? [] : fieldData(el)]))

const mock: { [key: number]: () => any } = {
  1: () => ({
    fio: `${faker.name.firstName()}-${faker.name.lastName()}`,
    dateOfBirth: faker.date.future(30, new Date(0)).getTime(),
    contacts: {
      phone: faker.phone.phoneNumber('380#########'),
      email: faker.internet.email(),
    },
    skills: [...Array(1 + faker.datatype.number(5))].map(() => faker.lorem.word()),
    workExpirience: [...Array(faker.datatype.number(3))].map(() => ({
      nameOfCompany: faker.company.companyName(),
      occupation: faker.name.jobTitle(),
      description: faker.lorem.words(20),
    })),
  }),
  2: () => {
    const list = [...Array(faker.datatype.number(10))].map(() => {
      const count = 1 + faker.datatype.number(10)
      const price = parseInt(faker.commerce.price(10, 1000))
      return {
        name: faker.lorem.word(),
        units: faker.lorem.word(),
        count,
        price,
        sum: price * count,
      }
    })
    return {
      organization: faker.company.companyName(),
      date: faker.date.past(1).getTime(),
      number: faker.datatype.number(100).toString(),
      from: `${faker.name.firstName()} ${faker.name.lastName()}`,
      to: `${faker.name.firstName()} ${faker.name.lastName()}`,
      reason: faker.lorem.words(10),
      list,
      totalSum: list.reduce((acc, el) => acc + el.price, 0),
    }
  },
}

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
    random: (state, action) => {
      if (state.document.blankId && mock[state.document.blankId]) state.document.data = mock[state.document.blankId]()
    },
  },
})

export const { reducer: documentCreateReducer, actions: documentCreateActions } = slice
