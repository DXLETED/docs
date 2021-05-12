import { createSlice } from '@reduxjs/toolkit'
import { loadState } from 'utils/localStorage'

export type TableSettingsState = {
  [key: string]: { [key: string]: boolean }
}
const initialState: TableSettingsState = {}

const slice = createSlice({
  name: 'tableSettings',
  initialState: loadState('tableSettings') || initialState,
  reducers: {
    initTable: (state, action) => {
      if (state[action.payload.table]) return
      state[action.payload.table] = Object.fromEntries(action.payload.columns.map((col: string) => [col, true]))
    },
    toggleColumnVisibility: (state, action) => {
      state[action.payload.table][action.payload.column] = !state[action.payload.table][action.payload.column]
    }
  },
})

export const { reducer: tableSettingsReducer, actions: tableSettingsActions } = slice
