import React, { useState } from 'react'
import st from 'styles/components/layout/Documents.module.sass'
import { Table, TableSearch } from 'components/Table'

const documentsDemo = [...Array(20)].map(() => ({
  id: 'ID',
  title: 'DOCUMENT TITLE',
  author: 'AAAAA',
  status: 'Archived',
  creationDate: '04.05.2021',
  updateDate: '07.05.2021',
}))

interface DocumentsProps {
  id: string
  label: string
}
export const Documents: React.FC<DocumentsProps> = ({ id, label }) => {
  const [search, setSearch] = useState('')
  return (
    <div className={st.table}>
      <Table
        id={id}
        label={label}
        head={{
          id: 'ID',
          title: 'Title',
          author: 'Author',
          status: 'Status',
          creationDate: 'Creation date',
          updateDate: 'Update date',
        }}
        els={documentsDemo}
        menu={<TableSearch value={search} set={setSearch} />}
      />
    </div>
  )
}
