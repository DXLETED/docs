import clsx from 'clsx'
import React from 'react'
import st from 'styles/ValidationErrors.module.sass'

interface ErrorElProps {
  msg?: string
}
const ErrorEl = ({ msg }: ErrorElProps) => <div className={st.el}>{msg}</div>

interface ValidationErrorsProps {
  errors?: string[]
  visible: boolean
}
export const ValidationErrors: React.FC<ValidationErrorsProps> = ({ errors = [], visible }) => (
  <div className={clsx(st.validationErrors, {[st.visible]: visible})}>
    {errors.map(msg => (
      <ErrorEl msg={msg} key={msg} />
    ))}
  </div>
)
