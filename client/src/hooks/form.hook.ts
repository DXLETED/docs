import { useState } from 'react'

interface FormData { [key: string]: string }
export const useForm = (initialState: FormData): [FormData, (key: string) => (value: string) => void] => {
  const [state, setState] = useState(initialState)
  const update = (key: string) => (value: string) => setState({...state, [key]: value})
  return [state, update]
}
