import React from 'react'
import st from 'styles/components/form/FormSubmit.module.sass'

interface FormSubmitProps {
  sendText?: string
  onSubmit: () => any
}
export const FormSubmit: React.FC<FormSubmitProps> = ({ sendText, onSubmit }) => (
  <div className={st.submit} onClick={() => onSubmit()}>
    <button type="submit">{sendText || 'SEND'}</button>
  </div>
)
