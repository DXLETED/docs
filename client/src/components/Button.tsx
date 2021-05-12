import clsx from 'clsx'
import React from 'react'
import { useHistory } from 'react-router'
import st from 'styles/components/Button.module.sass'

interface ButtonProps {
  label?: string
  to?: string
  onClick?: (e: React.MouseEvent) => void
  flex?: boolean
  center?: boolean
}
export const Button: React.FC<ButtonProps> = ({ label, to, onClick, flex, center }) => {
  const history = useHistory()
  const clickHandle = (e: React.MouseEvent) => {
    to && history.push(to)
    onClick?.(e)
  }
  return (
    <div className={clsx(st.button, { [st.flex]: flex, [st.center]: center })} onClick={clickHandle}>
      {label}
    </div>
  )
}
