import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './Components/Home';
import Login from './Components/Login';
import Signup from './Components/Signup';
import Navbar from './Navbar';

const App = () => {
  const location = useLocation();

  // Check if user is logged in (you can customize this logic)
  const isLoggedIn = localStorage.getItem('token'); // adjust 'token' to match your storage key

  // Define routes where Navbar should be hidden
  const hideNavbarRoutes = ['/', '/signup'];

  const shouldShowNavbar = isLoggedIn && !hideNavbarRoutes.includes(location.pathname);

  return (
    <div>
      {shouldShowNavbar && <Navbar />}
      <Routes>
        <Route path='/home' element={<Home />} />
        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
      </Routes>
    </div>
  );
};

export default App;
