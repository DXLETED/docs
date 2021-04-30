import React from 'react'
import st from 'styles/Page.module.sass'

interface IPage {
  children: React.ReactNode
}
export const Page: React.FC<IPage> = ({ children, ...props }: IPage) => (
  <div className={st.page}>
    <div className={st.inner} {...props}>
      {children}
    </div>
  </div>
)
