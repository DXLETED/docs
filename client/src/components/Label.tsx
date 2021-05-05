import React from 'react'
import st from 'styles/Label.module.sass'

interface ILabel {
  text?: string
}
export const Label: React.FC<ILabel> = ({ text }) => text ? <div className={st.label}>{text}</div> : <></>
