import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:3521",
  baseURL:"https://shortchat-backend.onrender.com"
});

export default api;
