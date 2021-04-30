import React from 'react'
import { Page } from '../components/Page'
import { Helmet } from 'react-helmet'
import { BlankElTypes, IBlank } from 'types'
import { FormEditor } from 'components/FormEditor'

const blank: IBlank = {
  username: {
    t: BlankElTypes.field,
    validate: [['Max length: 10', /^.{0,10}$/g]],
    placeholder: 'Username',
  },
  password: { t: BlankElTypes.field, placeholder: 'Password' },
}

export const LoginPage: React.FC = () => {
  return (
    <Page>
      <Helmet>
        <title>Login - Docs</title>
      </Helmet>
      <FormEditor blank={blank} sendText="LOG IN" />
    </Page>
  )
}
