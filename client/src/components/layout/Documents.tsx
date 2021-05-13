import React from 'react'
import st from 'styles/components/layout/Documents.module.sass'
import { Table } from 'components/Table'

const documentsDemo = [...Array(20)].map(() => ({
  id: 'ID',
  title: 'DOCUMENT TITLE',
  author: 'AAAAA',
  status: 'Archived',
  createDate: '10 days ago',
  updateDate: '7 days ago',
}))

interface DocumentsProps {
  id: string
}
export const Documents: React.FC<DocumentsProps> = ({ id }) => {
  return (
    <div className={st.table}>
      <Table
        id={id}
        head={{
          id: 'ID',
          title: 'Title',
          author: 'Author',
          status: 'Status',
          createDate: 'Create date',
          updateDate: 'Update data',
        }}
        els={documentsDemo}
      />
    </div>
  )
}
