import React, { memo } from 'react'
import clsx from 'clsx'
import st from 'styles/FormInput.module.sass'
import { Label } from 'components/Label'

interface ErrorElProps {
  msg?: string
}
const ErrorEl = ({ msg }: ErrorElProps) => <div className={st.el}>{msg}</div>

interface FormInputProps {
  label?: string
  value?: string
  set: (value: string) => void
  type?: string
  placeholder?: string
  errors?: string[]
}
export const FormInput: React.FC<FormInputProps> = memo(
  ({ label, value = '', set, type, placeholder, errors = [] }: FormInputProps) => {
    const onInput = (e: React.FormEvent): void => {
      const target = e.target as HTMLInputElement
      set(target.value)
    }
    return (
      <div className={clsx(st.input, { [st.hasErrors]: errors.length })}>
        <Label text={label} />
        <input onInput={onInput} {...{ value, placeholder, type }} />
        <div className={st.border} />
        <div className={st.errors}>
          {errors.map(msg => (
            <ErrorEl msg={msg} key={msg} />
          ))}
        </div>
      </div>
    )
  }
)
