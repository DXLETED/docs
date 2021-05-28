import React, { useState } from 'react'
import st from 'styles/components/input/Textarea.module.sass'
import clsx from 'clsx'
import { Label } from './Label'
import { ValidationErrors } from './ValidationErrors'

interface TextareaProps {
  label?: string
  value?: string
  set: (value: string) => void
  placeholder?: string
  errors?: string[]
  required?: boolean
  showErrors?: boolean
}
export const Textarea: React.FC<TextareaProps> = ({ label, value, set, placeholder, errors, required, showErrors }) => {
  const [isEdited, setIsEdited] = useState(false)
  const onInput = (e: React.FormEvent): void => {
    const target = e.target as HTMLInputElement
    set(target.value)
    !isEdited && setIsEdited(true)
  }
  return (
    <div
      className={clsx(st.textarea, {
        [st.hasErrors]: (isEdited || showErrors) && errors?.length,
      })}>
      <Label text={label} required={required} />
      <div className={st.inner}>
        <textarea {...{ value, onInput, placeholder }} spellCheck={false} />
      </div>
      {errors && <ValidationErrors errors={errors} visible={isEdited || !!showErrors} />}
    </div>
  )
}
