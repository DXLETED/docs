import { useState } from 'react'

interface IuseForm { [propName: string]: any }
export const useForm = (defaultState: IuseForm): [{[propName: string]: any}, (key: string) => (value: string) => void, () => void] => {
  const [state, setState] = useState(defaultState)
  const update = (key: string) => (value: string) => setState({...state, [key]: value})
  const reset = () => setState(defaultState)
  return [state, update, reset]
}