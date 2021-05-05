import { Container, IContainer } from 'components/Container'
import React from 'react'
import st from 'styles/FormContainer.module.sass'

export const FormContainer: React.FC<IContainer> = props => (
  <form onSubmit={e => e.preventDefault()}>
    <Container {...props} className={st.formContainer}></Container>
  </form>
)
