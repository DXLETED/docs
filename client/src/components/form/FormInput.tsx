import React, { memo } from 'react'
import clsx from 'clsx'
import st from 'styles/FormInput.module.sass'
import { isEqual } from 'lodash'
import { Label } from 'components/Label'

interface IErrorEl {
  msg?: string
}
const ErrorEl = ({ msg }: IErrorEl) => <div className={st.el}>{msg}</div>

type TValidateEl = [RegExp, string]
type TErrorEl = string

interface IFormInput {
  label?: string
  value?: string
  set: (value: string) => void
  type?: string
  placeholder?: string
  validate?: TValidateEl[]
  limit?: number
  required?: boolean
}
export const FormInput: React.FC<IFormInput> = memo(
  ({ label, value = '', set, type, placeholder, validate, limit = 20, required = false }: IFormInput) => {
    const errors: TErrorEl[] = [
      ...(required && !value.length ? (['Required'] as TErrorEl[]) : []),
      ...(validate || [])
        .map(([check, msg]: TValidateEl): [boolean, string] => [!!value.match(check), msg])
        .filter(([checked]) => !checked)
        .map(([_, msg]): TErrorEl => msg),
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
  },
  isEqual
)
