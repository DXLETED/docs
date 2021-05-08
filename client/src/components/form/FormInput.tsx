import React, { memo } from 'react'
import clsx from 'clsx'
import st from 'styles/FormInput.module.sass'
import { Label } from 'components/Label'
import { ValidationErrors } from 'components/ValidationErrors'

interface FormInputProps {
  label?: string
  value?: string
  set: (value: string) => void
  type?: string
  placeholder?: string
  errors?: string[]
  center?: boolean
  flex?: boolean
}
export const FormInput: React.FC<FormInputProps> = memo(
  ({ label, value = '', set, type, placeholder, errors, center, flex }: FormInputProps) => {
    const onInput = (e: React.FormEvent): void => {
      const target = e.target as HTMLInputElement
      set(target.value)
    }
    return (
      <div className={clsx(st.input, { [st.hasErrors]: errors?.length, [st.center]: center, [st.flex]: flex })}>
        <Label text={label} />
        <div className={st.inner}>
          <input onInput={onInput} {...{ value, placeholder, type }} />
        </div>
        <ValidationErrors errors={errors} visible={!!errors?.length} />
      </div>
    )
  }
)
