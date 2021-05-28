import React from 'react'
import { store } from 'store'
import { BrowserRouter, Route } from 'react-router-dom'
import { LoginPage } from './pages/login'
import { DocumentCreatePage } from './pages/documentCreate'
import { MainPage } from 'pages/main'
import { Provider } from 'react-redux'
import { MainLayout } from 'layouts/MainLayout'
import { LoginLayout } from 'layouts/LoginLayout'
import { DocumentsPage } from 'pages/documents'
import { MyDocumentsPage } from 'pages/mydocuments'
import { ArchivePage } from 'pages/archive'
import { DocumentPage } from 'pages/document'
import { Notifications } from 'components/Notifications'
import { notify } from 'utils/notify'

export const App: React.FC = () => (
  <Provider store={store}>
    <BrowserRouter>
      <Route exact path={['/', '/documents', '/documents/:id', '/mydocuments', '/archive', '/newdocument']}>
        <MainLayout>
          <Route exact path="/">
            <MainPage />
          </Route>
          <Route exact path="/documents">
            <DocumentsPage />
          </Route>
          <Route exact path="/mydocuments">
            <MyDocumentsPage />
          </Route>
          <Route exact path="/archive">
            <ArchivePage />
          </Route>
          <Route exact path="/newdocument">
            <DocumentCreatePage />
          </Route>
          <Route exact path="/documents/:id">
            <DocumentPage />
          </Route>
        </MainLayout>
      </Route>
      <Route exact path="/login">
        <LoginLayout>
          <LoginPage />
        </LoginLayout>
      </Route>
    </BrowserRouter>
    <Notifications />
  </Provider>
)

setTimeout(() => notify.info({ content: 'Info' }), 200)
setTimeout(() => notify.success({ content: 'Success' }), 400)
setTimeout(() => notify.warning({ content: 'Warning' }), 600)
setTimeout(() => notify.error({ content: 'Error' }), 800)
