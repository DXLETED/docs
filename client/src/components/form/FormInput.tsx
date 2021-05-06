import React, { memo } from 'react'
import clsx from 'clsx'
import st from 'styles/FormInput.module.sass'
import { Label } from 'components/Label'

interface ErrorElProps {
  msg?: string
}
const ErrorEl = ({ msg }: ErrorElProps) => <div className={st.el}>{msg}</div>

type ValidateEl = [RegExp, string]

interface FormInputProps {
  label?: string
  value?: string
  set: (value: string) => void
  type?: string
  placeholder?: string
  validate?: ValidateEl[]
  limit?: number
  required?: boolean
}
export const FormInput: React.FC<FormInputProps> = memo(
  ({ label, value = '', set, type, placeholder, validate, limit = 20, required = false }: FormInputProps) => {
    const errors: string[] = [
      ...(required && !value.length ? (['Required'] as string[]) : []),
      ...(validate || [])
        .map(([check, msg]: ValidateEl): [boolean, string] => [!!value.match(check), msg])
        .filter(([checked]) => !checked)
        .map(([_, msg]): string => msg),
    ]
    return (
      <div className={clsx(st.input, { [st.hasErrors]: errors.length })}>
        <Label text={label} />
        <input
          onInput={(e: React.FormEvent): void => {
            const target = e.target as HTMLInputElement
            if (target.value.length > limit && target.value.length > value.length) return
            set(target.value)
          }}
          {...{ value, placeholder, type }}
        />
        <div className={st.border} />
        <div className={st.validation}>
          <div className={st.errors}>{!!errors.length && errors.map(msg => <ErrorEl msg={msg} key={msg} />)}</div>
          <div className={st.length}>
            {value.length} / {limit}
          </div>
        </div>
      </div>
    )
  }
)
