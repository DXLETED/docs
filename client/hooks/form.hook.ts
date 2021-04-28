import { useState } from 'react'

export const useForm = (defaultState: {[propName: string]: any}) => {
  const [state, setState] = useState(defaultState)
  const update = (key: string) => (value: string) => setState({...state, [key]: value})
  const reset = () => setState(defaultState)
  return [state, update, reset]
}