import React from 'react'
import st from 'styles/layouts/MainLayout.module.sass'
import { Header } from 'components/Header'
import { Nav } from 'components/Nav'
import { Page } from 'components/Page'
import { useAuth } from 'hooks/auth.hook'
import { Redirect } from 'react-router'

interface MainLayoutProps {
  title?: string
  children: React.ReactNode
}
export const MainLayout: React.FC<MainLayoutProps> = ({ title, children }) => {
  const { isAuthorized } = useAuth()
  return isAuthorized ? (
    <>
      <Nav />
      <Page>
        <Header title={title} />
        <div className={st.main}>{children}</div>
      </Page>
    </>
  ) : (
    <Redirect to="/login" />
  )
}
