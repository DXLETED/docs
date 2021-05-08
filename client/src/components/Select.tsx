import React, { useRef, useState } from 'react'
import clsx from 'clsx'
import st from 'styles/components/Select.module.sass'
import { Label } from './Label'
import { useOnClickOutside } from 'hooks/onClickOutside.hook'
import { faCheck, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface SelectProps {
  label?: string
  selected: number
  options: string[]
  set: (n: number) => void
}
export const Select: React.FC<SelectProps> = ({ label, selected, options, set }) => {
  const ref = useRef<HTMLDivElement | any>(null)
  const [isOpen, setIsOpen] = useState(false)
  useOnClickOutside<HTMLDivElement>(ref, () => setIsOpen(false))
  const change = (i: number) => {
    set(i)
    setIsOpen(false)
  }
  return (
    <div className={clsx(st.select, { [st.open]: isOpen })} ref={ref}>
      <Label text={label} />
      <div className={st.inner} onClick={() => setIsOpen(!isOpen)}>
        <div className={st.label}>{options[selected]}</div>
        <FontAwesomeIcon className={st.arrow} icon={faChevronDown} />
        <div className={st.dropdown}>
          {options.map((o, i) => (
            <div className={st.el} onClick={() => change(i)} key={o + i}>
              {i === selected && <FontAwesomeIcon className={st.selected} icon={faCheck} size="sm" />}
              {o}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
