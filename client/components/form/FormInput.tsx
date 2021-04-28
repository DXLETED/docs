import React, { useRef, useState } from 'react'
import st from './FormInput.sass'
import { Component, IComponent } from '../Component'

interface IErrorEl { msg?: string, key: string }
const ErrorEl = ({msg, key}: IErrorEl) => <div className={st.el} key={key}>{msg}</div>

type TValidateEl = [string, string, (value: string) => boolean]
type TErrorEl = [boolean, string, string]

interface IFormInput extends IComponent {
  value: string,
  set: (value: string) => void,
  type?: string,
  placeholder?: string,
  validate?: Array<TValidateEl>
}
export const FormInput = ({value = '', set, type, placeholder, validate, ...props}: IFormInput) => {
  const [errors, setErrors] = useState<Array<TErrorEl>>([])
  const ref = useRef<HTMLInputElement>(null)
  return <Component className={st.input} {...props}>
    <input onInput={(e: React.FormEvent): void => {
      const target = e.target as HTMLInputElement
      validate && setErrors((validate || [])
        .map(([key, msg, check]: TValidateEl): TErrorEl => [check(target.value), key, msg])
        .filter(([checked]) => checked))
      set(target.value)
    }} {...{value, placeholder, ref, type}} />
    <div className={st.border} />
    <div className={st.errors}>
      {errors.map(([_, key, msg]: TErrorEl) => <ErrorEl msg={msg} key={key} />)}
    </div>
  </Component>
}