import React from 'react'
import { Helmet } from 'react-helmet'
import { Documents } from 'components/layout/Documents'

export const MyDocumentsPage: React.FC = () => (
  <>
    <Helmet>
      <title>My documents - Docs</title>
    </Helmet>
    <Documents id="mydocuments" />
  </>
)
