import { createSlice } from '@reduxjs/toolkit'

export type SwitchesState = { [key: string]: boolean }
const initialState: SwitchesState = {}

const slice = createSlice({
  name: 'switches',
  initialState,
  reducers: {
    switch: (state, action) => {
      state[action.payload.key] = !state[action.payload.key]
      return state
    },
  },
})

export const { reducer: switchesReducer, actions: switchesActions } = slice
