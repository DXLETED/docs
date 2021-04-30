import st from 'styles/FormElements.module.sass'
import React, { Fragment } from 'react'
import { BlankElTypes, IFormData, IFormDataEl } from 'types'
import { FormGroup } from './FormGroup'
import { FormInput } from './FormInput'

const elements: { [key in BlankElTypes]: any } = {
  field: (el: IFormDataEl) => (
    <FormInput
      value={el.value || ''}
      set={el.set || (() => {})}
      validate={el.validate}
      placeholder={el.placeholder}
    />
  ),
  group: (el: IFormDataEl) => (
    <FormGroup groupName={el.groupName} els={el.els || {}} />
  ),
}

interface IFormElements {
  els: IFormData
}
export const FormElements: React.FC<IFormElements> = ({ els }) => (
  <div className={st.elements}>
    {Object.entries(els).map(([key, el]: [string, IFormDataEl]) => (
      <Fragment key={key}>{elements[el.t](el)}</Fragment>
    ))}
  </div>
)
