import { useForm } from 'hooks/form.hook'
import st from 'styles/FormEditor.module.sass'
import React from 'react'
import { Form } from './form/Form'
import { FormElements } from './form/FormElements'
import { FormSubmit } from './form/FormSubmit'
import { IBlank } from 'types/blank'

interface IFormEditor {
  blank: IBlank
  sendText?: string
}
export const FormEditor: React.FC<IFormEditor> = ({ blank, sendText = 'SEND' }) => {
  const [formData, submit] = useForm(blank)
  return (
    <Form>
      <div className={st.content}>
        <FormElements els={formData} />
      </div>
      <FormSubmit sendText={sendText} submit={submit} />
    </Form>
  )
}
