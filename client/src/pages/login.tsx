import React from 'react'
import { Helmet } from 'react-helmet'
import { LoginLayout } from 'layouts/LoginLayout'
import { FormInput } from 'components/form/FormInput'
import { useForm } from 'hooks/form.hook'
import { FormContainer } from 'components/form/FormContainer'
import { FormSubmit } from 'components/form/FormSubmit'
import { api } from 'core/api'

export const LoginPage: React.FC = () => {
  const [formData, update] = useForm({ username: '', password: '' })
  return (
    <LoginLayout>
      <Helmet>
        <title>Login - Docs</title>
      </Helmet>
      <FormContainer p20 bg>
        <FormInput label="Login" value={formData.username} set={update('username')} />
        <FormInput label="Password" value={formData.password} set={update('password')} />
        <FormSubmit
          sendText="LOG IN"
          submit={() => api.auth.login(formData as { username: string; password: string })}
        />
      </FormContainer>
    </LoginLayout>
  )
}
