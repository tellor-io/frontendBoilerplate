import React, { useContext } from 'react'
//Components
import Nav from './components/frontendBoilerplate/Nav'
import Footer from './components/frontendBoilerplate/Footer'
//Styles
import './App.css'
//Context
import { ModeContext } from './contexts/Mode'

function App() {
  //Context
  const mode = useContext(ModeContext)
  return (
    <div className={mode && mode.mode === 'dark' ? 'App' : 'AppLight'}>
      <Nav />
      <div
        className={
          mode && mode.mode === 'dark' ? 'HeroContainer' : 'HeroContainerLight'
        }
      >
        <h1>Your App Goes Here</h1>
      </div>
      <Footer />
    </div>
  )
}

export default App
