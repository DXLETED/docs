import React from 'react'
import st from './Form.sass'
import { Component } from '../Component'

export const Form = ({children}) => <Component className={st.form}>{children}</Component>