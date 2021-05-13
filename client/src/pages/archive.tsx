import React from 'react'
import { Helmet } from 'react-helmet'
import { Documents } from 'components/layout/Documents'

export const ArchivePage: React.FC = () => (
  <>
    <Helmet>
      <title>Archive - Docs</title>
    </Helmet>
    <Documents id="archive" />
  </>
)
