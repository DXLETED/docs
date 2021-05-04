import React from 'react'
import { Helmet } from 'react-helmet'
import { FormEditor } from 'components/FormEditor'
import { LoginLayout } from 'layouts/LoginLayout'
import { IBlank } from 'types/blank'

const blank: IBlank = {
  username: {
    t: 'field',
    validate: [[/^.{0,10}$/g, 'Max length: 10'], [/^.{0,10}$/g, 'Max length: 10']],
    placeholder: 'Username',
    required: true,
  },
  password: { t: 'field', placeholder: 'Password', required: true },
}

export const LoginPage: React.FC = () => {
  return (
    <LoginLayout>
      <Helmet>
        <title>Login - Docs</title>
      </Helmet>
      <FormEditor blank={blank} sendText="LOG IN" />
    </LoginLayout>
  )
}
