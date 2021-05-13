import React from 'react'
import st from 'styles/components/Nav.module.sass'
import clsx from 'clsx'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArchive,
  faBars,
  faFileUpload,
  faFolderOpen,
  faHome,
  faListAlt,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons'
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
      <NavItem to="/documents" title="Documents" icon={faListAlt} />
      <NavItem to="/mydocuments" title="My documents" icon={faFolderOpen} />
      <NavItem to="/archive" title="Archive" icon={faArchive} />
      <NavItem to="/documents/create" title="Create document" icon={faFileUpload} />
    </nav>
  )
}
