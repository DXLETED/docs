import React from 'react'
import st from 'styles/pages/LoginPage.module.sass'
import { Helmet } from 'react-helmet'
import { Input } from 'components/input/Input'
import { useForm } from 'hooks/form.hook'
import { useHistory, useLocation } from 'react-router'
import { login } from 'store/auth'
import { useDispatchTyped } from 'hooks/dispatchTyped.hook'
import { notify } from 'utils/notify'

export const LoginPage: React.FC = () => {
  const [formData, update] = useForm({ username: '', password: '' })
  const dispatch = useDispatchTyped()
  const history = useHistory()
  const query = new URLSearchParams(useLocation().search)
  const submit = () =>
    dispatch(login(formData)).then(res =>
      res.meta.requestStatus === 'fulfilled'
        ? history.push(query.get('to') || '/')
        : notify.error({ content: (res as any).error.message })
    )
  return (
    <>
      <Helmet>
        <title>Login - Docs</title>
      </Helmet>
      <div className={st.form}>
        <Input label="Имя пользователя" value={formData.username} set={update('username')} />
        <Input label="Пароль" type="password" value={formData.password} set={update('password')} />
        <div className={st.submit} onClick={submit}>Вход</div>
      </div>
    </>
  )
}
