import React, { useRef, useState } from 'react'
import st from 'styles/components/table/TableFilter.module.sass'
import clsx from 'clsx'
import { faCheck, faEllipsisV } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useOnClickOutside } from 'hooks/onClickOutside.hook'

interface TableFilterProps {
  label: string
  options: { [key: string]: string }
  filter: { [el: string]: boolean }
  set: (keys: { [key: string]: boolean }) => void
}
export const TableFilter: React.FC<TableFilterProps> = ({ label, options, filter, set }) => {
  const ref = useRef<HTMLDivElement | any>(null)
  const [isOpen, setIsOpen] = useState(false)
  useOnClickOutside<HTMLDivElement>(ref, () => setIsOpen(false))
  const toggle = (el: string) => set({ ...filter, [el]: !filter[el] })
  return (
    <div className={clsx(st.tableFilter, { [st.open]: isOpen })} ref={ref}>
      <div className={st.inner} onClick={() => setIsOpen(true)}>
        <FontAwesomeIcon className={st.icon} icon={faEllipsisV} />
        {label}
      </div>
      <div className={st.dropdown}>
        {Object.entries(options).map(([key, val]) => (
          <div className={st.el} onClick={() => toggle(key)} key={key}>
            <div className={st.check}>
              {filter[key] && <FontAwesomeIcon className={st.selected} icon={faCheck} size="sm" />}
            </div>
            {val}
          </div>
        ))}
      </div>
    </div>
  )
}
