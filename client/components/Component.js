import React from 'react'
import st from './Component.sass'
import cn from 'classnames'

const classes = ['flex', 'm'],
      events = ['onClick', 'onInput', 'onFocus', 'onBlur']

export const Component = ({className, children, ...props}) =>
  <div
  className={cn(className, Object.fromEntries(classes.map(cl => [[st[cl]], props[cl]])))}
  {...Object.fromEntries(events.filter(e => e in props).map(e => [e, props[e]]))}>
    {children}
  </div>