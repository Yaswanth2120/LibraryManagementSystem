import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5050/api', // change if your backend port differs
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;