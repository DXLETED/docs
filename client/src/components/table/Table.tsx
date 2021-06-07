import React, { useCallback, useEffect, useRef, useState } from 'react'
import st from 'styles/components/table/Table.module.sass'
import clsx from 'clsx'
import color from 'color'
import { faCheck, faSlidersH } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useOnClickOutside } from 'hooks/onClickOutside.hook'
import { loadState, saveState } from 'utils/localStorage'
import { useHistory } from 'react-router'

interface TableProps {
  id: string
  label?: string
  head: { [key: string]: string }
  els: { d: { [key: string]: string | { d: string; color?: string } }; link?: string }[]
  menu?: React.ReactNode
  load?: () => void
  extended?: boolean
}
export const Table: React.FC<TableProps> = ({ id, label, head, els, menu, load }) => {
  const history = useHistory()
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
              <tr className={clsx({ [st.link]: !!el.link })} key={i} onClick={() => el.link && history.push(el.link)}>
                {headEntries.map(([key]) => {
                  const data =
                    typeof el.d[key] === 'object'
                      ? (el.d[key] as { d: string; color?: string })
                      : { d: el.d[key], color: undefined }
                  return (
                    <td key={key}>
                      <span style={{ background: data.color && color(data.color).alpha(0.2).toString() }}>
                        {data.d}
                      </span>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
