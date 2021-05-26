import React, { useRef } from 'react'
import ReactDOM from 'react-dom'
import st from 'styles/components/Modal.module.sass'
import clsx from 'clsx'
import { useOnClickOutside } from 'hooks/onClickOutside.hook'

interface ModalProps {
  title?: string
  children: React.ReactNode
  isOpen: boolean
  close: () => void
}
export const Modal: React.FC<ModalProps> = ({ title, children, isOpen, close }) => {
  const ref = useRef<HTMLDivElement | any>(null)
  useOnClickOutside<HTMLDivElement>(ref, () => isOpen && close())
  return ReactDOM.createPortal(
    <div className={clsx(st.modal, { [st.open]: isOpen })}>
      <div className={st.inner} ref={ref}>
        {title && <div className={st.title}>{title}</div>}
        <div className={st.content}>{children}</div>
      </div>
    </div>,
    document.getElementById('modals') as HTMLElement
  )
}
