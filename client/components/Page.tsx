import React from 'react'
import st from './Page.sass'
import { Component, IComponent } from './Component'

interface IPage extends IComponent { children: React.ReactNode }
export const Page = ({children, ...props}: IPage) => <Component className={st.page} {...props}>
  <div className={st.inner}>{children}</div></Component>