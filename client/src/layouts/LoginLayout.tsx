import React from 'react'
import st from 'styles/layouts/LoginLayout.module.sass'
import { Page } from 'components/Page'

interface LoginLayoutProps {
  children: React.ReactNode
}
export const LoginLayout: React.FC<LoginLayoutProps> = ({ children }) => (
  <Page>
    <div className={st.main}>{children}</div>
  </Page>
)
