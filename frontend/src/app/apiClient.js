import axios from 'axios';

const apiBase = import.meta.env.VITE_API_URL || '';

export const api = axios.create({
  baseURL: apiBase,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('hw_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

