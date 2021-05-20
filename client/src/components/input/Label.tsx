import React from 'react'
import st from 'styles/components/input/Label.module.sass'

interface LabelProps {
  text?: string
  required?: boolean
}
export const Label: React.FC<LabelProps> = ({ text, required }) =>
  text ? (
    <div className={st.label}>
      {text}
      {required && ' *'}
    </div>
  ) : (
    <></>
  )
