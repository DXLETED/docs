import React from 'react'
import { Helmet } from 'react-helmet'
import { Documents } from 'components/Documents'
import { useTranslation } from 'react-i18next'

export const MyDocumentsPage: React.FC = () => {
  const { t } = useTranslation()
  return (
    <>
      <Helmet>
        <title>My documents - Docs</title>
      </Helmet>
      <Documents
        id="mydocuments"
        label={t('documents.myDocuments')}
        path="/documents/my"
        head={{
          id: t('documents.head.id'),
          title: t('documents.head.title'),
          author: t('documents.head.author'),
          status: t('documents.head.status'),
          creationDate: t('documents.head.creationDate'),
          updateDate: t('documents.head.updateDate'),
        }}
        statusFilter
      />
    </>
  )
}
