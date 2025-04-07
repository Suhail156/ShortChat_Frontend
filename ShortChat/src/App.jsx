import React from 'react'
import { Routes ,Route} from 'react-router-dom'
import Home from './Components/Home'
import Login from './Components/Login'
import Signup from './Components/Signup'
const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/home' element={<Home/>} ></Route>
        <Route path='/' element={<Login/>} ></Route>
        <Route path='/signup' element={<Signup/>} ></Route>
      </Routes>
    </div>
  )
}

export default App
