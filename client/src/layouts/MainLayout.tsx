import React from 'react'
import st from 'styles/layouts/MainLayout.module.sass'
import clsx from 'clsx'
import { Header } from 'components/layout/Header'
import { Nav } from 'components/layout/Nav'
import { useAuth } from 'hooks/auth.hook'
import { Redirect, useLocation } from 'react-router'
import { useSelectorTyped } from 'hooks/selectorTyped.hook'

interface MainLayoutProps {
  title?: string
  children: React.ReactNode
}
export const MainLayout: React.FC<MainLayoutProps> = ({ title, children }) => {
  const location = useLocation()
  const { isAuthorized } = useAuth()
  const isNavOpen = useSelectorTyped(s => s.switches.nav)
  return isAuthorized ? (
    <>
      <Nav />
      <div className={clsx(st.page, { [st.navOpen]: isNavOpen })}>
        <Header title={title} />
        <div className={st.main}>{children}</div>
      </div>
    </>
  ) : (
    <Redirect to={`/login?to=${location.pathname}`} />
  )
}
