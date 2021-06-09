import React, { useRef, useState } from 'react'
import clsx from 'clsx'
import st from 'styles/components/input/Select.module.sass'
import { Label } from './Label'
import { useOnClickOutside } from 'hooks/onClickOutside.hook'
import { faCheck, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslation } from 'react-i18next'

interface SelectProps {
  label?: string
  selected: number | null
  options: string[]
  set: (n: number | null) => void
  empty?: boolean
  open?: boolean
}
export const Select: React.FC<SelectProps> = ({ label, selected, options, set, empty, open }) => {
  const { t } = useTranslation()
  const ref = useRef<HTMLDivElement | any>(null)
  const [isOpen, setIsOpen] = useState(open || false)
  useOnClickOutside<HTMLDivElement>(ref, () => !open && setIsOpen(false))
  const change = (i: number | null) => {
    set(i)
    setIsOpen(false)
  }
  return (
    <div className={clsx(st.select, { [st.open]: isOpen })} ref={ref}>
      <Label text={label} />
      <div className={st.inner} onClick={() => setIsOpen(!isOpen)}>
        <div className={st.label}>{typeof selected === 'number' ? options[selected] : t('notChosen')}</div>
        <FontAwesomeIcon className={st.arrow} icon={faChevronDown} />
        {isOpen && (
          <div className={st.dropdown}>
            {empty && (
              <div className={st.el} onClick={() => change(null)}>
                {t('notChosen')}
              </div>
            )}
            {options.map((o, i) => (
              <div className={st.el} onClick={() => change(i)} key={o + i}>
                {i === selected && <FontAwesomeIcon className={st.selected} icon={faCheck} size="sm" />}
                {o}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
