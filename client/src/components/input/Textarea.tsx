import React from 'react'
import st from 'styles/components/input/Textarea.module.sass'
import { Label } from './Label'

interface TextareaProps {
  label?: string
  value?: string
  set: (value: string) => void
  placeholder?: string
}
export const Textarea: React.FC<TextareaProps> = ({ label, value, set, placeholder }) => {
  const onInput = (e: React.FormEvent): void => {
    const target = e.target as HTMLInputElement
    set(target.value)
  }
  return (
    <div className={st.textarea}>
      <Label text={label} />
      <div className={st.inner}>
        <textarea {...{value, onInput, placeholder}} spellCheck={false} />
      </div>
    </div>
  )
}
