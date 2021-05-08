import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import { LoginPage } from './pages/login'
import { DocumentPage } from './pages/document'
import { MainPage } from 'pages/main'
import { Provider } from 'react-redux'
import { store } from 'store'
import { MainLayout } from 'layouts/MainLayout'
import { LoginLayout } from 'layouts/LoginLayout'

export const App: React.FC = () => (
  <Provider store={store}>
    <BrowserRouter>
      <Route exact path={['/', '/document']}>
        <MainLayout>
          <Route exact path="/">
            <MainPage />
          </Route>
          <Route exact path="/document">
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
