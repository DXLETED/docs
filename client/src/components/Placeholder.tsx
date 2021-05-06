import st from 'styles/Placeholder.module.sass'
import React from 'react'

interface PlaceholderProps {
  children: React.ReactNode
}
export const Placeholder: React.FC<PlaceholderProps> = ({ children }) => (
  <div className={st.placeholder}>{children}</div>
)
