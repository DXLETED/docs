import React from 'react'
import st from 'styles/components/Label.module.sass'

interface LabelProps {
  text?: string
}
export const Label: React.FC<LabelProps> = ({ text }) => (text ? <div className={st.label}>{text}</div> : <></>)
