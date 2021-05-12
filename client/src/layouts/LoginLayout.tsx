import React from 'react'
import st from 'styles/layouts/LoginLayout.module.sass'

interface LoginLayoutProps {
  children: React.ReactNode
}
export const LoginLayout: React.FC<LoginLayoutProps> = ({ children }) => (
  <div className={st.page}>
    <div className={st.main}>{children}</div>
  </div>
)
