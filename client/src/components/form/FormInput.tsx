import React, { useRef, useState } from 'react'
import cn from 'classnames'
import st from 'styles/FormInput.module.sass'

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
export const FormInput: React.FC<IFormInput> = ({
  value = '',
  set,
  type,
  placeholder,
  validate,
}: IFormInput) => {
  const [errors, setErrors] = useState<Array<TErrorEl>>([])
  const ref = useRef<HTMLInputElement>(null)
  return (
    <div className={cn(st.input, { [st.hasErrors]: errors.length })}>
      <input
        onInput={(e: React.FormEvent): void => {
          const target = e.target as HTMLInputElement
          validate &&
            setErrors(
              (validate || [])
                .map(
                  ([msg, check]: TValidateEl): TErrorEl => [
                    !target.value.match(check),
                    msg,
                  ]
                )
                .filter(([checked]) => checked)
            )
          set(target.value)
        }}
        {...{ value, placeholder, ref, type }}
      />
      <div className={st.border} />
      <div className={st.errors}>
        {errors.length ? (
          errors.map(([checked, msg]: TErrorEl) => (
            <ErrorEl msg={msg} key={msg + checked} />
          ))
        ) : (
          <ErrorEl msg="No errors" />
        )}
      </div>
    </div>
  )
}
