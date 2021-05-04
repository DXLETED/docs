import { MainLayout } from 'layouts/MainLayout'
import React from 'react'
import { Helmet } from 'react-helmet'
import { Placeholder } from '../components/Placeholder'

export const MainPage: React.FC = () => (
  <MainLayout>
    <Helmet>
      <title>Docs</title>
    </Helmet>
    <Placeholder>MAIN</Placeholder>
  </MainLayout>
)
