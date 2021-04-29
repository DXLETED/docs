import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import { Header } from './components/Header'
import { LoginPage } from './pages/login'
import { MainPage } from './pages/main'

export const App: React.FC = () => (
  <BrowserRouter>
    <Header />
    <Route exact path="/">
      <MainPage />
    </Route>
    <Route exact path="/login">
      <LoginPage />
    </Route>
  </BrowserRouter>
)
