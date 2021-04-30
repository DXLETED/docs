import st from 'styles/FormSubmit.module.sass'

interface IFormSubmit {
  sendText?: string
  submit: () => any
}
export const FormSubmit = ({ sendText, submit }: IFormSubmit) => (
  <div className={st.submit} onClick={() => submit()}>
    <button>{sendText || 'SEND'}</button>
  </div>
)
