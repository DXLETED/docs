import React, { useCallback, useEffect, useRef, useState } from 'react'
import st from 'styles/components/Table.module.sass'
import clsx from 'clsx'
import { faCheck, faEllipsisV, faSlidersH } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useOnClickOutside } from 'hooks/onClickOutside.hook'
import { loadState, saveState } from 'utils/localStorage'
import { onlyUnique } from 'utils/onlyUnique'

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
  column: string
  els: { [key: string]: string }[]
  filter: { [el: string]: boolean }
  set: (keys: { [key: string]: boolean }) => void
}
export const TableFilter: React.FC<TableFilterProps> = ({ label, column, els, filter, set }) => {
  const ref = useRef<HTMLDivElement | any>(null)
  const [isOpen, setIsOpen] = useState(false)
  useOnClickOutside<HTMLDivElement>(ref, () => setIsOpen(false))
  const variants = els.map(el => el[column]).filter(onlyUnique)
  const toggle = (el: string) => set({ ...filter, [el]: !filter[el] })
  return (
    <div className={clsx(st.tableFilter, { [st.open]: isOpen })} ref={ref}>
      <div className={st.inner} onClick={() => setIsOpen(true)}>
        <FontAwesomeIcon className={st.icon} icon={faEllipsisV} />
        {label}
      </div>
      <div className={st.dropdown}>
        {variants.map(el => (
          <div className={st.el} onClick={() => toggle(el)} key={el}>
            <div className={st.check}>
              {filter[el] && <FontAwesomeIcon className={st.selected} icon={faCheck} size="sm" />}
            </div>
            {el}
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
}
export const Table: React.FC<TableProps> = ({ id, label, head, els, menu, load }) => {
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
    []
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
              <tr key={i}>
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
