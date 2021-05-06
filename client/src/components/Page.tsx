import React from 'react'
import st from 'styles/Page.module.sass'

interface PageProps {
  children: React.ReactNode
}
export const Page: React.FC<PageProps> = ({ children, ...props }) => (
  <div className={st.page}>
    <div className={st.inner} {...props}>
      {children}
    </div>
  </div>
)
