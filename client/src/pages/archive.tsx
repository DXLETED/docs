import React from 'react'
import { Helmet } from 'react-helmet'
import { Documents } from 'components/Documents'
import { useTranslation } from 'react-i18next'

export const ArchivePage: React.FC = () => {
  const { t } = useTranslation()
  return (
    <>
      <Helmet>
        <title>Archive - Docs</title>
      </Helmet>
      <Documents
        id="archive"
        label={t('documents.archive')}
        path="/documents/archive"
        head={{
          id: t('documents.head.id'),
          title: t('documents.head.title'),
          author: t('documents.head.author'),
          creationDate: t('documents.head.creationDate'),
          updateDate: t('documents.head.updateDate'),
        }}
      />
    </>
  )
}
