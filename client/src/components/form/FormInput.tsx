import React, { memo } from 'react'
import cn from 'classnames'
import st from 'styles/FormInput.module.sass'
import { isEqual } from 'lodash'

interface IErrorEl {
  msg?: string
}
const ErrorEl = ({ msg }: IErrorEl) => <div className={st.el}>{msg}</div>

type TValidateEl = [string, RegExp]
type TErrorEl = [boolean, string]

interface IFormInput {
  value: string
  set: (value: string) => void
  type?: string
  placeholder?: string
  validate?: TValidateEl[]
}
export const FormInput: React.FC<IFormInput> = memo(({
  value = '',
  set,
  type,
  placeholder,
  validate,
}: IFormInput) => {
  const errors = (validate || [])
        .map(
          ([msg, check]: TValidateEl): TErrorEl => [
            !value.match(check),
            msg,
          ]
        )
        .filter(([checked]) => checked)
  return (
    <div className={cn(st.input, { [st.hasErrors]: errors.length })}>
      <input
        onInput={(e: React.FormEvent): void => {
          const target = e.target as HTMLInputElement
          set(target.value)
        }}
        {...{ value, placeholder, type }}
      />
      <div className={st.border} />
      <div className={st.errors}>
        {errors.length ? (
          errors.map(([checked, msg]: TErrorEl) => (
            <ErrorEl msg={msg} key={msg + checked} />
          ))
        ) : (
          <ErrorEl msg="" />
        )}
      </div>
    </div>
  )
}, isEqual)
