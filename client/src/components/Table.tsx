import React, { useCallback, useEffect, useRef, useState } from 'react'
import st from 'styles/components/Table.module.sass'
import clsx from 'clsx'
import { faCheck, faEllipsisV, faSlidersH } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useOnClickOutside } from 'hooks/onClickOutside.hook'
import { loadState, saveState } from 'utils/localStorage'

interface TableSearchProps {
  value: string
  set: (value: string) => void
}
export const TableSearch: React.FC<TableSearchProps> = ({ value, set }) => {
  const onInput = (e: React.FormEvent): void => set((e.target as HTMLInputElement).value)
  return (
    <div className={st.tableSearch}>
      <input {...{ value, onInput }} placeholder="Поиск" />
    </div>
  )
}

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
  const upd = useCallback(
    () => {
      const el = innerRef.current
      el.scrollHeight - el.getBoundingClientRect().height - el.scrollTop < 50 && load?.()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [load]
  )
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
