import React, { useRef, useState } from 'react'
import st from 'styles/components/Table.module.sass'
import clsx from 'clsx'
import { faCheckSquare, faSlidersH, faSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useOnClickOutside } from 'hooks/onClickOutside.hook'
import { useTableSettings } from 'hooks/tableSettings'

interface TableProps {
  id: string
  label?: string
  head: { [key: string]: string }
  els: { [key: string]: string }[]
}
export const Table: React.FC<TableProps> = ({ id, label, head, els }) => {
  const settingsRef = useRef<HTMLDivElement | any>(null)
  const [isSettingsVisible, setIsSettingsVisible] = useState(false)
  const [settings, toggleSettings] = useTableSettings(id, Object.keys(head))
  useOnClickOutside<HTMLDivElement>(settingsRef, () => isSettingsVisible && setIsSettingsVisible(false))
  const headEntries = Object.entries(head).filter(([col]) => settings[col])
  return (
    <div className={st.table}>
      <div className={st.head}>
        <div className={st.label}>{label}</div>
        <div className={st.settingsButton} onClick={() => setIsSettingsVisible(!isSettingsVisible)}>
          <FontAwesomeIcon icon={faSlidersH} />
        </div>
        <div className={clsx(st.settings, { [st.visible]: isSettingsVisible })} ref={settingsRef}>
          {Object.entries(head).map(([key, el]) => (
            <div className={st.el} onClick={() => toggleSettings(key)} key={key}>
              {settings[key] ? (
                <FontAwesomeIcon className={st.selected} icon={faCheckSquare} size="sm" />
              ) : (
                <FontAwesomeIcon className={st.selected} icon={faSquare} size="sm" />
              )}
              {el}
            </div>
          ))}
        </div>
      </div>
      <table>
        <thead>
          <tr>
            {headEntries.map(([key, el]) => (
              <td key={key}>{el}</td>
            ))}
          </tr>
        </thead>
        <tbody>
          {els.map((el, i) => (
            <tr key={i}>
              {headEntries.map(([key, val]) => (
                <td key={key}>{el[key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
