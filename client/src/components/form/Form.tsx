import React from 'react'
import st from 'styles/Form.module.sass'
import { Component, IComponent } from '../Component'

interface IForm extends IComponent {
  children: React.ReactNode
}
export const Form: React.FC<IForm> = ({ children }: IForm) => <Component className={st.form}>{children}</Component>
