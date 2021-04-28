import React from 'react'
import { Helmet } from 'react-helmet'
import { Page } from '../components/Page'
import { Placeholder } from '../components/Placeholder'

export const MainPage: React.FC = () => <Page>
  <Helmet><title>Docs</title></Helmet>
  <Placeholder>MAIN</Placeholder>
</Page>