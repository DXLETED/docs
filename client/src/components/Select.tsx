import React, { useRef, useState } from 'react'
import clsx from 'clsx'
import { useOnClickOutside } from 'hooks/onClickOutside'
import st from 'styles/Select.module.sass'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface SelectProps {
  selected: number
  options: string[]
  set: (n: number) => void
}
export const Select: React.FC<SelectProps> = ({ selected, options, set }) => {
  const ref = useRef<HTMLDivElement | any>(null)
  const [isOpen, setIsOpen] = useState(false)
  useOnClickOutside<HTMLDivElement>(ref, () => setIsOpen(false))
  const change = (i: number) => {
    set(i)
    setIsOpen(false)
  }
  return (
    <div className={clsx(st.select, { [st.open]: isOpen })} ref={ref}>
      <div className={st.selected} onClick={() => setIsOpen(!isOpen)}>
        <div className={st.label}>{options[selected]}</div>
        <FontAwesomeIcon className={st.arrow} icon={faChevronDown} />
      </div>
      <div className={st.dropdown}>
        {options.map((o, i) => (
          <div className={st.el} onClick={() => change(i)} key={o + i}>
            {o}
          </div>
        ))}
      </div>
    </div>
  )
}
