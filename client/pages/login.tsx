import React from 'react'
import { Form } from '../components/form/Form'
import { FormInput } from '../components/form/FormInput'
import { FormSubmit } from '../components/form/FormSubmit'
import { Page } from '../components/Page'
import { useForm } from '../hooks/form.hook'

export const LoginPage = () => {
  const [formData, update, reset] = useForm({username: '', password: ''})
  return <Page>
    <Form>
      <FormInput value={formData.username} set={update('username')} placeholder="Username" validate={[
        ['mlen', 'Max length: 24', str => str.length > 24]
      ]} m />
      <FormInput value={formData.password} set={update('password')} placeholder="Password" type="password" m />
      <FormSubmit sendText="LOG IN" />
    </Form>
  </Page>
}