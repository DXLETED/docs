import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import { Documents } from 'components/layout/Documents'
import { Table, TableFilter, TableSearch } from 'components/Table'

const data = [...Array(20)].map((_, i) => ({
  id: `${i + 1}`,
  title: 'НАЗВАНИЕ ДОКУМЕНТА',
  author: ['AAAAA', 'BBBBB', 'CCCCC', 'DDDDD'][Math.floor(Math.random() * 4)],
  status: ['На рассмотрении', 'Подписан всеми', 'Отклонен', 'В архиве'][Math.floor(Math.random() * 4)],
  creationDate: '04.05.2021',
  updateDate: '07.05.2021',
}))

export const MyDocumentsPage: React.FC = () => {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<{ [el: string]: boolean }>({})
  const searchString = search.toLowerCase()
  let els = data
  search && (els = els.filter(el => el.title.toLowerCase().includes(searchString)))
  const filteredEls = Object.values(statusFilter).some(Boolean) ? els.filter(el => statusFilter[el.status]) : els
  return (
    <>
      <Helmet>
        <title>Documents - Docs</title>
      </Helmet>
      <Documents>
        <Table
          id="mydocuments"
          label="Мои документы"
          head={{
            id: 'ID',
            title: 'Название',
            author: 'Автор',
            status: 'Статус',
            creationDate: 'Дата создания',
            updateDate: 'Дата обновления',
          }}
          els={filteredEls}
          menu={
            <>
              <TableFilter label="Статус" column="status" els={els} filter={statusFilter} set={setStatusFilter} />
              <TableSearch value={search} set={setSearch} />
            </>
          }
        />
      </Documents>
    </>
  )
}
