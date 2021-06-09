import React from 'react'
import st from 'styles/pages/LoginPage.module.sass'
import { Helmet } from 'react-helmet'
import { Input } from 'components/input/Input'
import { useForm } from 'hooks/form.hook'
import { useHistory, useLocation } from 'react-router'
import { login } from 'store/auth'
import { useDispatchTyped } from 'hooks/dispatchTyped.hook'
import { Form } from 'components/Form'
import { useTranslation } from 'react-i18next'

export const LoginPage: React.FC = () => {
  const { t } = useTranslation()
  const [formData, update] = useForm({ username: '', password: '' })
  const dispatch = useDispatchTyped()
  const history = useHistory()
  const query = new URLSearchParams(useLocation().search)
  const submit = () =>
    dispatch(login(formData)).then(
      res => res.meta.requestStatus === 'fulfilled' && history.push(query.get('to') || '/')
    )
  return (
    <>
      <Helmet>
        <title>Login - Docs</title>
      </Helmet>
      <div className={st.form}>
        <Form onSubmit={submit}>
          <Input label={t('username')} value={formData.username} set={update('username')} />
          <Input label={t('password')} type="password" value={formData.password} set={update('password')} />
          <div className={st.submit} onClick={submit}>
            {t('login')}
          </div>
        </Form>
      </div>
    </>
  )
}
