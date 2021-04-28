import React from 'react'
import st from './Form.sass'
import { Component, IComponent } from '../Component'

interface IForm extends IComponent { children: React.ReactNode }
export const Form = ({children}: IForm) => <Component className={st.form}>{children}</Component>