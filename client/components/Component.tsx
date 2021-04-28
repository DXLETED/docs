import React from 'react'
import st from './Component.sass'
import cn from 'classnames'

const classes = ['m', 'flex'],
      events = ['onClick', 'onInput', 'onFocus', 'onBlur']

export interface IComponent {
  className?: Array<string>,
  children?: React.ReactNode,
  m?: boolean,
  flex?: boolean
}
export const Component: React.FC<IComponent> = ({className, children, ...props}: IComponent) =>
  <div
  className={cn(className, Object.fromEntries(classes.map(cl => [[st[cl]], (props as any)[cl]])))}
  {...Object.fromEntries(events.filter(e => e in props).map(e => [e, (props as any)[e]]))}>
    {children}
  </div>