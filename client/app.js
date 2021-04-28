import './styles.sass'

import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route } from 'react-router-dom'
import { Header } from './components/Header'
import { LoginPage } from './pages/login'
import { MainPage } from './pages/main'

ReactDOM.render(<BrowserRouter>
  <Header />
  <Route exact path="/"><MainPage /></Route>
  <Route exact path="/login"><LoginPage /></Route>
</BrowserRouter>, document.getElementsByTagName('root')[0])