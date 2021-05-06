import { Container, ContainerProps } from 'components/Container'
import React from 'react'
import st from 'styles/FormContainer.module.sass'

export const FormContainer: React.FC<ContainerProps> = props => (
  <form onSubmit={e => e.preventDefault()}>
    <Container {...props} className={st.formContainer}></Container>
  </form>
)
