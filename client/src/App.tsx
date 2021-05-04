import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import { LoginPage } from './pages/login'
import { DocumentPage } from './pages/document'
import { MainPage } from 'pages/main'
import { Provider } from 'react-redux'
import { store } from 'store'

export const App: React.FC = () => (
  <Provider store={store}>
    <BrowserRouter>
      <Route exact path="/">
        <MainPage />
      </Route>
      <Route exact path="/login">
        <LoginPage />
      </Route>
      <Route exact path="/document/:id">
        <DocumentPage />
      </Route>
    </BrowserRouter>
  </Provider>
)
