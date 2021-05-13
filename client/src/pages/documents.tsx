import React from 'react'
import st from 'styles/pages/DocumentsPage.module.sass'
import { Table } from 'components/Table'
import { Helmet } from 'react-helmet'

const documentsList = [...Array(20)].map(() => ({
  id: 'ID',
  title: 'DOCUMENT TITLE',
  author: 'AAAAA',
  status: 'Archived',
  createDate: '10 days ago',
  updateDate: '7 days ago',
}))

export const DocumentsPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Documents - Docs</title>
      </Helmet>
      <div className={st.table}>
        <Table
          id="documents"
          label="Documents"
          head={{
            id: 'ID',
            title: 'Title',
            author: 'Author',
            status: 'Status',
            createDate: 'Create date',
            updateDate: 'Update data',
          }}
          els={documentsList}
        />
      </div>
    </>
  )
}
