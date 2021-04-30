import { useForm } from 'hooks/form.hook'
import React from 'react'
import { IBlank } from 'types'
import { Form } from './form/Form'
import { FormElements } from './form/FormElements'
import { FormSubmit } from './form/FormSubmit'

interface IFormEditor {
  blank: IBlank
  sendText?: string
}
export const FormEditor: React.FC<IFormEditor> = ({
  blank,
  sendText = 'SEND',
}) => {
  const [formData, submit] = useForm(blank)
  return (
    <Form>
      <FormElements els={formData} />
      <FormSubmit sendText={sendText} submit={submit} />
    </Form>
  )
}
