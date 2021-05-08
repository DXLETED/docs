import React from 'react'
import st from 'styles/components/Error.module.sass'

interface ErrorProps {
  msg: React.ReactNode
}
export const Error: React.FC<ErrorProps> = ({ msg }) => {
  return <div className={st.error}>{msg}</div>
}
