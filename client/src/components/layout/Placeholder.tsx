import React from 'react'
import st from 'styles/components/layout/Placeholder.module.sass'

interface PlaceholderProps {
  children: React.ReactNode
}
export const Placeholder: React.FC<PlaceholderProps> = ({ children }) => (
  <div className={st.placeholder}>{children}</div>
)
