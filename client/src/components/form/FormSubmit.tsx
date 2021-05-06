import st from 'styles/FormSubmit.module.sass'

interface FormSubmitProps {
  sendText?: string
  onSubmit: () => any
}
export const FormSubmit = ({ sendText, onSubmit }: FormSubmitProps) => (
  <div className={st.submit} onClick={() => onSubmit()}>
    <button type="submit">{sendText || 'SEND'}</button>
  </div>
)
