import { useState } from 'react'

type FormData = { [key: string]: string }
type FormUpdate = (key: string) => (value: string) => void

export const useForm = (initialState: FormData): [FormData, FormUpdate] => {
  const [state, setState] = useState(initialState)
  const update: FormUpdate = key => value => setState({...state, [key]: value})
  return [state, update]
}
