import React from 'react'
import st from './FormSubmit.sass'
import { Component, IComponent } from '../Component'

interface IFormSubmit extends IComponent { sendText?: string }
export const FormSubmit = ({sendText}: IFormSubmit) => <Component className={st.submit}>
  <button>{sendText || 'SEND'}</button>
</Component>