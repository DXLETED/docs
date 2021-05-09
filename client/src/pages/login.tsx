import React from 'react'
import { Helmet } from 'react-helmet'
import { Input } from 'components/Input'
import { useForm } from 'hooks/form.hook'
import { FormContainer } from 'components/form/FormContainer'
import { FormSubmit } from 'components/form/FormSubmit'
import { useHistory, useLocation } from 'react-router'
import { login } from 'store/auth'
import { useDispatchTyped } from 'hooks/dispatchTyped.hook'
import { requestError } from 'utils/requestError'

export const LoginPage: React.FC = () => {
  const [formData, update] = useForm({ username: '', password: '' })
  const dispatch = useDispatchTyped()
  const history = useHistory()
  const query = new URLSearchParams(useLocation().search)
  const onSubmit = () =>
    dispatch(login(formData)).then(res =>
      res.meta.requestStatus === 'fulfilled'
        ? history.push(query.get('to') || '/')
        : requestError((res as any).error.message)
    )
  return (
    <>
      <Helmet>
        <title>Login - Docs</title>
      </Helmet>
      <FormContainer classNames={['p-20']} bg>
        <Input label="Username" value={formData.username} set={update('username')} />
        <Input label="Password" type="password" value={formData.password} set={update('password')} />
        <FormSubmit sendText="LOG IN" onSubmit={onSubmit} />
      </FormContainer>
    </>
  )
}
