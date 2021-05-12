import React, { useState } from 'react'
import st from 'styles/components/Input.module.sass'
import clsx from 'clsx'
import { Label } from 'components/input/Label'
import { ValidationErrors } from 'components/input/ValidationErrors'

interface InputProps {
  label?: string
  value?: string
  set: (value: string) => void
  type?: string
  placeholder?: string
  errors?: string[]
  required?: boolean
  center?: boolean
  flex?: boolean
}
export const Input: React.FC<InputProps> = ({
  label,
  value = '',
  set,
  type,
  placeholder,
  errors,
  required,
  center,
  flex,
}) => {
  const [isEdited, setIsEdited] = useState(false)
  const onInput = (e: React.FormEvent): void => {
    const target = e.target as HTMLInputElement
    set(target.value)
    !isEdited && setIsEdited(true)
  }
  return (
    <div
      className={clsx(st.input, {
        [st.hasErrors]: isEdited && errors?.length,
        [st.center]: center,
        [st.flex]: flex,
      })}>
      <Label text={label} required={required} />
      <div className={st.inner}>
        <input onInput={onInput} {...{ value, placeholder, type }} />
      </div>
      {errors && <ValidationErrors errors={errors} visible={isEdited} />}
    </div>
  )
}
