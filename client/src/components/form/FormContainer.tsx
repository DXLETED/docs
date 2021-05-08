import React from 'react'
import st from 'styles/components/form/FormContainer.module.sass'
import { Container, ContainerProps } from 'components/Container'

export const FormContainer: React.FC<ContainerProps> = props => (
  <form onSubmit={e => e.preventDefault()}>
    <Container {...props} className={st.formContainer}></Container>
  </form>
)
