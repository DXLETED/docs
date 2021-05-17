import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import { Documents } from 'components/layout/Documents'
import { Table, TableSearch } from 'components/Table'

const data = [...Array(20)].map((_, i) => ({
  id: `${i + 1}`,
  title: 'НАЗВАНИЕ ДОКУМЕНТА',
  author: ['AAAAA', 'BBBBB', 'CCCCC', 'DDDDD'][Math.floor(Math.random() * 4)],
  creationDate: '04.05.2021',
  updateDate: '07.05.2021',
}))

export const ArchivePage: React.FC = () => {
  const [search, setSearch] = useState('')
  const searchString = search.toLowerCase()
  let els = data
  search && (els = els.filter(el => el.title.toLowerCase().includes(searchString)))
  return (
    <>
      <Helmet>
        <title>Archive - Docs</title>
      </Helmet>
      <Documents>
        <Table
          id="archive"
          label="Архив"
          head={{
            id: 'ID',
            title: 'Название',
            author: 'Автор',
            creationDate: 'Дата создания',
            updateDate: 'Дата обновления',
          }}
          els={els}
          menu={<TableSearch value={search} set={setSearch} />}
        />
      </Documents>
    </>
  )
}
