import React from 'react'
import { store } from 'store'
import { BrowserRouter, Route } from 'react-router-dom'
import { LoginPage } from './pages/login'
import { DocumentPage } from './pages/document'
import { MainPage } from 'pages/main'
import { Provider } from 'react-redux'
import { MainLayout } from 'layouts/MainLayout'
import { LoginLayout } from 'layouts/LoginLayout'
import { DocumentsPage } from 'pages/documents'
import { MyDocumentsPage } from 'pages/mydocuments'
import { ArchivePage } from 'pages/archive'

export const App: React.FC = () => (
  <Provider store={store}>
    <BrowserRouter>
      <Route exact path={['/', '/documents', '/mydocuments', '/archive', '/documents/create']}>
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
          <Route exact path="/documents/create">
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
  </Provider>
)
