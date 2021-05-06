import st from 'styles/Header.module.sass'
import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from 'hooks/auth.hook'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { Container } from './Container'

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

interface HeaderProps {
  title?: string
}
export const Header: React.FC<HeaderProps> = ({ title = '' }) => {
  const { user, logout } = useAuth()
  return (
    <header className={st.header}>
      <div className={st.title}>{title}</div>
      <div className={st.r}>
        {user ? (
          <div className={st.user}>
            <Container classNames={['mv-20', 'aic']}>{user.username}</Container>
            <div className={st.logout} onClick={logout}>
              <FontAwesomeIcon icon={faSignOutAlt} />
            </div>
          </div>
        ) : (
          <HeaderLink to="/login" exact>
            LOG IN
          </HeaderLink>
        )}
      </div>
    </header>
  )
}
