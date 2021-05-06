import { useState } from 'react'

type FormUpdate = (key: string) => (value: string) => void

export const useForm = <T>(initialState: T): [T, FormUpdate] => {
  const [state, setState] = useState(initialState)
  const update: FormUpdate = key => value => setState({...state, [key]: value})
  return [state, update]
}
