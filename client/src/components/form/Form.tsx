import React from 'react'
import st from 'styles/Form.module.sass'

interface IForm {
  children: React.ReactNode
}
export const Form: React.FC<IForm> = ({ children }: IForm) => (
  <div className={st.form}>{children}</div>
)
