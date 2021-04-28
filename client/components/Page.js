import React from 'react'
import st from './Page.sass'
import { Component } from './Component'

export const Page = ({children, ...props}) => <Component className={st.page} {...props}>
  <div className={st.inner}>{children}</div></Component>