import React from 'react'
import st from './FormSubmit.sass'
import { Component } from '../Component'

export const FormSubmit = ({sendText}) => <Component className={st.submit}>
  <button>{sendText || 'SEND'}</button>
</Component>