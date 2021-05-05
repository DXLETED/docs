import clsx, { ClassValue } from 'clsx'
import React from 'react'
import st from 'styles/Container.module.sass'

interface IContainer extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  classNames?: ClassValue
  p10?: boolean
  p20?: boolean
  m10?: boolean
  m20?: boolean
  bg?: boolean
}
export const Container: React.FC<IContainer> = ({ classNames, p10, p20, m10, m20, bg, ...props }) => (
  <div
    {...props}
    className={clsx(classNames, { 'p-10': p10, 'p-20': p20, 'm-10': m10, 'm-20': m20, [st.bg]: bg })}></div>
)
