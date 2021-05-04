import st from 'styles/Header.module.sass'
import React from 'react'
import { NavLink } from 'react-router-dom'

interface IHeaderLink {
  to: string
  children?: React.ReactNode
  exact?: boolean
}
const HeaderLink = ({ to, children, exact }: IHeaderLink) => (
  <NavLink className={st.link} to={to} exact={exact} activeClassName={st.active}>
    {children}
  </NavLink>
)

interface IHeader {
  title?: string
}
export const Header: React.FC<IHeader> = ({ title = '' }) => {
  return (
    <header>
      <div className={st.title}>{title}</div>
      <div className={st.r}>
        <HeaderLink to="/login" exact>
          LOG IN
        </HeaderLink>
      </div>
    </header>
  )
}
