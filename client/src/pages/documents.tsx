import React from 'react'
import { Helmet } from 'react-helmet'
import { Documents } from 'components/layout/Documents'

export const DocumentsPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Documents - Docs</title>
      </Helmet>
      <Documents
        id="documents"
        label="Новые документы"
        path="/documents"
        head={{
          id: 'ID',
          title: 'Название',
          author: 'Автор',
          status: 'Статус',
          creationDate: 'Дата создания',
          updateDate: 'Дата обновления',
        }}
      />
    </>
  )
}
