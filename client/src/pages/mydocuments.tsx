import React from 'react'
import { Helmet } from 'react-helmet'
import { Documents } from 'Documents'

export const MyDocumentsPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>My documents - Docs</title>
      </Helmet>
      <Documents
        id="mydocuments"
        label="Мои документы"
        path="/documents/my"
        head={{
          id: 'ID',
          title: 'Название',
          author: 'Автор',
          status: 'Статус',
          creationDate: 'Дата создания',
          updateDate: 'Дата обновления',
        }}
        statusFilter
      />
    </>
  )
}
