import st from 'styles/FormElements.module.sass'
import React, { Fragment } from 'react'
import { FormGroup } from './FormGroup'
import { FormInput } from './FormInput'
import { BlankElTypes } from 'types/blank'
import { IFormData, IFormDataEl } from 'types/formData'

const elements: { [key in BlankElTypes]: any } = {
  field: (el: IFormDataEl) => (
    <FormInput
      value={el.value || ''}
      set={el.set || (() => {})}
      validate={el.validate}
      placeholder={el.placeholder}
      required={el.required}
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
