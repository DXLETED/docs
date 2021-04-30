import st from 'styles/Nav.module.sass'
import React, { useState } from 'react'
import cn from 'classnames'
import { NavLink } from 'react-router-dom'

import imgDocument from 'assets/img/document.png'
import imgMenu from 'assets/img/menu.png'

interface INavItem {
  id: string
  title: string
  isOpen: boolean
}
const NavItem: React.FC<INavItem> = ({ id, title, isOpen }: INavItem) => (
  <NavLink to={`/document/${id}`} className={st.navItem}>
    <img src={imgDocument} alt="document" />
    {isOpen && <div className={st.title}>{title}</div>}
  </NavLink>
)

export const Nav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <nav className={cn({ [st.open]: isOpen })}>
      <div className={st.navMenu} onClick={() => setIsOpen(!isOpen)}>
        <img src={imgMenu} alt="Open/Close" />
      </div>
      {[...Array(5)].map((_, i) => (
        <NavItem
          id={i.toString()}
          title={`Document ${i + 1}`}
          isOpen={isOpen}
          key={i}
        />
      ))}
    </nav>
  )
}
