import { useCallback, useState } from 'react'
import { BlankElTypes, IBlank, IFormData, IFormDataEl } from 'types'
import { blankFormData } from 'utils/blankFormData'
import { set } from 'object-path-immutable'

const submitEls: { [key in BlankElTypes]: any } = {
  [BlankElTypes.field]: (el: IFormDataEl) => el.value,
  [BlankElTypes.group]: (el: IFormDataEl) => submit(el.els || {}),
}
const submit = (formData: IFormData) =>
  Object.fromEntries(
    Object.entries(formData).map(([key, el]) => [key, submitEls[el.t](el)])
  )

export const useForm = (blank: IBlank): [IFormData, () => any, () => void] => {
  const update = useCallback(
    (path: string[], val: string) =>
      setState((state) => set(state, [...path, 'value'], val)),
    []
  )
  const formData = blankFormData(blank, update)
  const [state, setState] = useState(formData)
  const reset = () => setState(formData)
  return [state, () => console.log(submit(state)), reset]
}
