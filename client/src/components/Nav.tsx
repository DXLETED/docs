import React from 'react'
import st from 'styles/components/Nav.module.sass'
import clsx from 'clsx'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faFileAlt, faHome, IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { useSelectorTyped } from 'hooks/selectorTyped.hook'
import { useDispatchTyped } from 'hooks/dispatchTyped.hook'
import { switchesActions } from 'store/switches'

interface NavItemProps {
  to: string
  title: string
  icon: IconDefinition
}
const NavItem: React.FC<NavItemProps> = ({ to, title, icon }) => (
  <NavLink to={to} className={st.navItem}>
    <FontAwesomeIcon className={st.icon} icon={icon} />
    <div className={st.title}>{title}</div>
  </NavLink>
)

export const Nav: React.FC = () => {
  const dispatch = useDispatchTyped()
  const isOpen = useSelectorTyped(s => s.switches.nav)
  const switchIsOpen = () => dispatch(switchesActions.switch({ key: 'nav' }))
  return (
    <nav className={clsx(st.nav, { [st.open]: isOpen })}>
      <div className={st.navMenu}>
        <div className={st.switch} onClick={switchIsOpen}>
          <FontAwesomeIcon icon={faBars} />
        </div>
      </div>
      <NavItem to="/" title="Main" icon={faHome} />
      <NavItem to="/document" title="Document" icon={faFileAlt} />
    </nav>
  )
}
