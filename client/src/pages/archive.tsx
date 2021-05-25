import React from 'react'
import { Helmet } from 'react-helmet'
import { Documents } from 'components/layout/Documents'

export const ArchivePage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Archive - Docs</title>
      </Helmet>
      <Documents
        id="archive"
        label="Архив"
        path="/documents/archive"
        head={{
          id: 'ID',
          title: 'Название',
          author: 'Автор',
          creationDate: 'Дата создания',
          updateDate: 'Дата обновления',
        }}
      />
    </>
  )
}
