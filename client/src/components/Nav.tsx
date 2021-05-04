import st from 'styles/Nav.module.sass'
import React, { useState } from 'react'
import clsx from 'clsx'
import { NavLink } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faFileAlt, faHome, IconDefinition } from '@fortawesome/free-solid-svg-icons'

interface INavItem {
  to: string
  title: string
  icon: IconDefinition
}
const NavItem: React.FC<INavItem> = ({ to, title, icon }: INavItem) => (
  <NavLink to={to} className={st.navItem}>
    <FontAwesomeIcon className={st.icon} icon={icon} />
    <div className={st.title}>{title}</div>
  </NavLink>
)

export const Nav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <nav className={clsx({ [st.open]: isOpen })}>
      <div className={st.navMenu}>
        <div className={st.switch} onClick={() => setIsOpen(!isOpen)}>
          <FontAwesomeIcon icon={faBars} size="lg" />
        </div>
      </div>
      <NavItem to="/" title="Main" icon={faHome} />
      <NavItem to="/document/Iydvfe3hF6" title="Iydvfe3hF6" icon={faFileAlt} />
    </nav>
  )
}
