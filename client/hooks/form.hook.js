import { useState } from 'react'

export const useForm = (defaultState) => {
  const [state, setState] = useState(defaultState)
  const update = key => value => setState({...state, [key]: value})
  const reset = () => setState(defaultState)
  return [state, update, reset]
}