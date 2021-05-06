import React from 'react'
import { Helmet } from 'react-helmet'
import { FormInput } from 'components/form/FormInput'
import { useForm } from 'hooks/form.hook'
import { FormContainer } from 'components/form/FormContainer'
import { FormSubmit } from 'components/form/FormSubmit'
//import { useHistory } from 'react-router'
import { login } from 'store/auth'
import { useDispatch } from 'react-redux'

export const LoginPage: React.FC = () => {
  const [formData, update] = useForm({ username: '', password: '' })
  const dispatch = useDispatch()
  //const history = useHistory()
  const onSubmit = async () => {
    dispatch(login(formData))
    //history.push('/')
  }
  return (
    <>
      <Helmet>
        <title>Login - Docs</title>
      </Helmet>
      <FormContainer p20 bg>
        <FormInput label="Username" value={formData.username} set={update('username')} />
        <FormInput label="Password" type="password" value={formData.password} set={update('password')} />
        <FormSubmit
          sendText="LOG IN"
          onSubmit={onSubmit}
        />
      </FormContainer>
    </>
  )
}
