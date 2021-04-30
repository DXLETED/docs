import { Nav } from 'components/Nav'
import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import { Header } from './components/Header'
import { MainPage } from './pages/main'
import { LoginPage } from './pages/login'
import { DocumentPage } from './pages/document'

export const App: React.FC = () => (
  <BrowserRouter>
    <Nav />
    <main>
      <Header />
      <Route exact path="/">
        <MainPage />
      </Route>
      <Route exact path="/login">
        <LoginPage />
      </Route>
      <Route exact path="/document/:id">
        <DocumentPage />
      </Route>
    </main>
  </BrowserRouter>
)
