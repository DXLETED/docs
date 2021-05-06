import st from 'styles/FormSubmit.module.sass'

interface FormSubmitProps {
  sendText?: string
  submit: () => any
}
export const FormSubmit = ({ sendText, submit }: FormSubmitProps) => (
  <div className={st.submit} onClick={() => submit()}>
    <button type="submit">{sendText || 'SEND'}</button>
  </div>
)
