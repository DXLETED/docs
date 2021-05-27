import React, { useCallback, useEffect, useRef, useState } from 'react'
import st from 'styles/components/table/Table.module.sass'
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
  menu?: React.ReactNode
  load?: () => void
  link?: (el: { [key: string]: string }) => void
}
export const Table: React.FC<TableProps> = ({ id, label, head, els, menu, load, link }) => {
  const innerRef = useRef<HTMLDivElement | any>(null)
  const settingsRef = useRef<HTMLDivElement | any>(null)
  const [isSettingsVisible, setIsSettingsVisible] = useState(false)
  const [settings, setSettings] = useState(
    loadState(`tableSettings-${id}`) || Object.fromEntries(Object.keys(head).map(col => [col, true]))
  )
  const toggleSettings = (key: string) => {
    const newState = { ...settings, [key]: !settings[key] }
    setSettings(newState)
    saveState(`tableSettings-${id}`, newState)
  }
  const upd = useCallback(() => {
    const el = innerRef.current
    el.scrollHeight - el.getBoundingClientRect().height - el.scrollTop < 50 && load?.()
  }, [load])
  useEffect(() => {
    els.length && upd()
  }, [upd, els])
  useOnClickOutside<HTMLDivElement>(settingsRef, () => isSettingsVisible && setIsSettingsVisible(false))
  const headEntries = Object.entries(head).filter(([col]) => settings[col] !== false)
  const renderHead = () => (
    <div className={st.head}>
      <div className={st.label}>{label}</div>
      <div className={st.menu}>
        {menu}
        <div className={st.settingsButton} onClick={() => setIsSettingsVisible(!isSettingsVisible)}>
          <FontAwesomeIcon icon={faSlidersH} />
        </div>
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
  )
  const renderTHead = () => (
    <thead>
      <tr>
        {headEntries.map(([key, el]) => (
          <th key={key}>{el}</th>
        ))}
      </tr>
    </thead>
  )
  return (
    <div className={st.table}>
      {renderHead()}
      <div className={st.inner} onScroll={upd} ref={innerRef}>
        <table>
          {renderTHead()}
          <tbody>
            {els.map((el, i) => (
              <tr className={clsx({ [st.link]: !!link })} key={i} onClick={() => link?.(el)}>
                {headEntries.map(([key]) => (
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
