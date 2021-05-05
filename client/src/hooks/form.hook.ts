import { useState } from 'react'

interface IFormData { [key: string]: string }
export const useForm = (initialState: IFormData): [IFormData, (key: string) => (value: string) => void] => {
  const [state, setState] = useState(initialState)
  const update = (key: string) => (value: string) => setState({...state, [key]: value})
  return [state, update]
}
