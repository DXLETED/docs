import './styles.sass'

import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route } from 'react-router-dom'
import { Header } from './components/Header'
import { LoginPage } from './pages/login'
import { MainPage } from './pages/main'

const App: React.FC = () => <BrowserRouter>
  <Header />
  <Route exact path="/"><MainPage /></Route>
  <Route exact path="/login"><LoginPage /></Route>
</BrowserRouter>

ReactDOM.render(<App />, document.getElementsByTagName('root')[0])