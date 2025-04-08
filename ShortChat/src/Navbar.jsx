import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.name) {
      setUserName(user.name);
    } else {
      setUserName('Guest');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex items-center justify-between">
      {/* Brand */}
      <div className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-wide">
        Short<span className="text-indigo-600">Chat</span>
      </div>

      {/* Mobile Toggle */}
      <div className="md:hidden text-indigo-600" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
      </div>

      {/* Nav Items */}
      <div
        className={`${
          isOpen ? 'block' : 'hidden'
        } md:flex md:items-center gap-6 mt-4 md:mt-0 text-sm`}
      >
        <span className="text-gray-700 font-medium flex items-center gap-1">
          👋 Hello, <span className="font-semibold text-indigo-600">{userName}</span>
        </span>
        <button
          onClick={handleLogout}
          className="bg-indigo-600 text-white px-4 py-1.5 rounded-full hover:bg-indigo-700 transition duration-200 shadow-md"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
