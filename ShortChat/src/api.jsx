import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3521",
});

export default api;
