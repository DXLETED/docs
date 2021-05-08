import React from 'react'
import st from 'styles/components/Container.module.sass'
import clsx, { ClassValue } from 'clsx'

export interface ContainerProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  classNames?: ClassValue
  bg?: boolean
}
export const Container: React.FC<ContainerProps> = ({ className, classNames, bg, ...props }) => (
  <div
    {...props}
    className={clsx(className, classNames, { [st.bg]: bg })}></div>
)
