import React from 'react'
import { useTranslation } from 'react-i18next'
import st from 'styles/components/table/TableSearch.module.sass'

interface TableSearchProps {
  value: string
  set: (value: string) => void
}
export const TableSearch: React.FC<TableSearchProps> = ({ value, set }) => {
  const { t } = useTranslation()
  const onInput = (e: React.FormEvent): void => set((e.target as HTMLInputElement).value)
  return (
    <div className={st.tableSearch}>
      <input {...{ value, onInput }} placeholder={t('search')} />
    </div>
  )
}
