import api from '../api/axios';

export const loginUser = (username, password) =>
  api.post('/auth/login', { username, password });

export const logoutUser = () => api.post('/auth/logout');

export const checkSession = () => api.get('/auth/session');
