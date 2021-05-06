import { Header } from 'components/Header'
import { Nav } from 'components/Nav'
import { Page } from 'components/Page'
import { useAuth } from 'hooks/auth.hook'
import React from 'react'
import { Redirect } from 'react-router'
import st from 'styles/MainLayout.module.sass'

interface MainLayoutProps {
  title?: string
  children: React.ReactNode
}
export const MainLayout: React.FC<MainLayoutProps> = ({ title, children }) => {
  const { isAuthorized } = useAuth()
  return isAuthorized ? (
    <>
      <Nav />
      <div className={st.main}>
        <Header title={title} />
        <Page>{children}</Page>
      </div>
    </>
  ) : (
    <Redirect to="/login" />
  )
}
