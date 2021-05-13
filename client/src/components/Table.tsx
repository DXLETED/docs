import React, { useRef, useState } from 'react'
import st from 'styles/components/Table.module.sass'
import clsx from 'clsx'
import { faCheck, faSlidersH } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useOnClickOutside } from 'hooks/onClickOutside.hook'
import { loadState, saveState } from 'utils/localStorage'

interface TableProps {
  id: string
  label?: string
  head: { [key: string]: string }
  els: { [key: string]: string }[]
}
export const Table: React.FC<TableProps> = ({ id, label, head, els }) => {
  const settingsRef = useRef<HTMLDivElement | any>(null)
  const [isSettingsVisible, setIsSettingsVisible] = useState(false)
  const [settings, setSettings] = useState(
    loadState(`tableSettings-${id}`) || Object.fromEntries(Object.keys(head).map(col => [col, true]))
  )
  const toggleSettings = (key: string) => {
    setSettings({ ...settings, [key]: !settings[key] })
    saveState(`tableSettings-${id}`, settings)
  }
  useOnClickOutside<HTMLDivElement>(settingsRef, () => isSettingsVisible && setIsSettingsVisible(false))
  const headEntries = Object.entries(head).filter(([col]) => settings[col])
  const render = {
    head: () => (
      <div className={st.head}>
        <div className={st.label}>{label}</div>
        <div className={st.settingsButton} onClick={() => setIsSettingsVisible(!isSettingsVisible)}>
          <FontAwesomeIcon icon={faSlidersH} />
        </div>
        <div className={clsx(st.settings, { [st.visible]: isSettingsVisible })} ref={settingsRef}>
          {Object.entries(head).map(([key, el]) => (
            <div className={st.el} onClick={() => toggleSettings(key)} key={key}>
              <div className={st.check}>
                {settings[key] && <FontAwesomeIcon className={st.selected} icon={faCheck} size="sm" />}
              </div>
              {el}
            </div>
          ))}
        </div>
      </div>
    ),
    thead: () => (
      <thead>
        <tr>
          {headEntries.map(([key, el]) => (
            <th key={key}>{el}</th>
          ))}
        </tr>
      </thead>
    ),
  }
  return (
    <div className={st.table}>
      {render.head()}
      <div className={st.inner}>
        <table>
          {render.thead()}
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
    </div>
  )
}
