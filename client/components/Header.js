import st from './Header.sass'
import React from 'react'
import { NavLink } from 'react-router-dom'

const HeaderLink = ({to, children, exact}) => <NavLink className={st.link} to={to} exact={exact} activeClassName={st.active}>{children}</NavLink>

export const Header = () => {
  return <header>
    <div className={st.l}>
      <HeaderLink to="/" exact>MAIN</HeaderLink>
    </div>
    <div className={st.r}>
      <HeaderLink to="/login" exact>LOG IN</HeaderLink>
    </div>
  </header>
}