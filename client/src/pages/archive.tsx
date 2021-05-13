import React from 'react'
import st from 'styles/pages/ArchivePage.module.sass'
import { Helmet } from 'react-helmet'
import { Table } from 'components/Table'

const archiveList = [...Array(20)].map(() => ({
  id: 'ID',
  title: 'DOCUMENT TITLE',
  author: 'AAAAA',
  status: 'Archived',
  createDate: '10 days ago',
  updateDate: '7 days ago',
}))

export const ArchivePage: React.FC = () => <>
<Helmet>
  <title>Archive - Docs</title>
</Helmet>
<div className={st.table}>
  <Table
    id="archive"
    label="Archive"
    head={{
      id: 'ID',
      title: 'Title',
      author: 'Author',
      status: 'Status',
      createDate: 'Create date',
      updateDate: 'Update data',
    }}
    els={archiveList}
  />
</div>
</>