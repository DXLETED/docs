import React from 'react'
import st from 'styles/pages/MyDocumentsPage.module.sass'
import { Helmet } from 'react-helmet'
import { Table } from 'components/Table'

const myDocumentsList = [...Array(20)].map(() => ({
  id: 'ID',
  title: 'DOCUMENT TITLE',
  author: 'AAAAA',
  status: 'Archived',
  createDate: '10 days ago',
  updateDate: '7 days ago',
}))

export const MyDocumentsPage: React.FC = () => (
  <>
    <Helmet>
      <title>My documents - Docs</title>
    </Helmet>
    <div className={st.table}>
      <Table
        id="mydocuments"
        label="My documents"
        head={{
          id: 'ID',
          title: 'Title',
          author: 'Author',
          status: 'Status',
          createDate: 'Create date',
          updateDate: 'Update data',
        }}
        els={myDocumentsList}
      />
    </div>
  </>
)
