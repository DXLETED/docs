import React from 'react'
import st from 'styles/components/layout/Documents.module.sass'

interface DocumentsProps {
  children?: React.ReactNode
}
export const Documents: React.FC<DocumentsProps> = ({ children }) => <div className={st.table}>{children}</div>
