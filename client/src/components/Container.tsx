import React from 'react'
import clsx, { ClassValue } from 'clsx'

export interface ContainerProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  classes?: ClassValue
}
export const Container: React.FC<ContainerProps> = ({ className, classes, ...props }) => (
  <div {...props} className={clsx(className, classes)}></div>
)
