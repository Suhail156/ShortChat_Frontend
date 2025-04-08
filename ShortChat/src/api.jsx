// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:3521", // adjust if needed
//   headers: {
//     "Content-Type": "application/json",
//   },
// });
// export default api;




// src/api.js
import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://localhost:3521',
  baseURL:"https://shortchat-backend.onrender.com"
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
