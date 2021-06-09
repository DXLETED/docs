import React from 'react'
import st from 'styles/components/layout/Header.module.sass'
import { NavLink } from 'react-router-dom'
import { useAuth } from 'hooks/auth.hook'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { Container } from '../Container'
import { useTranslation } from 'react-i18next'
import { Select } from 'components/input/Select'
import { unsubscribe } from 'store/status'
import { useDispatchTyped } from 'hooks/dispatchTyped.hook'

const languages = {
  en: 'EN | English',
  ru: 'RU | Русский',
}

interface HeaderLinkProps {
  to: string
  children?: React.ReactNode
  exact?: boolean
}
const HeaderLink: React.FC<HeaderLinkProps> = ({ to, children, exact }) => (
  <NavLink className={st.link} to={to} exact={exact} activeClassName={st.active}>
    {children}
  </NavLink>
)

export const Header: React.FC = () => {
  const dispatch = useDispatchTyped()
  const { user, logout } = useAuth()
  const { i18n } = useTranslation()
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    dispatch(unsubscribe())
  }
  return (
    <header className={st.header}>
      <div className={st.language}>
        <Select
          selected={Object.keys(languages).findIndex(l => l === (i18n.language || '').slice(0, 2))}
          options={Object.values(languages)}
          set={n => changeLanguage(Object.keys(languages)[n as number])}
        />
      </div>
      {user ? (
        <div className={st.user}>
          <Container classes={['mv-20', 'aic']}>{user.username}</Container>
          <div className={st.logout} onClick={logout}>
            <FontAwesomeIcon icon={faSignOutAlt} />
          </div>
        </div>
      ) : (
        <HeaderLink to="/login" exact>
          LOG IN
        </HeaderLink>
      )}
    </header>
  )
}
