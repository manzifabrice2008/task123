import api from '../api/axios';

export const getDailyReport = (date) =>
  api.get('/reports/daily', { params: { date } });

export const getMonthlyReport = (year, month) =>
  api.get('/reports/monthly', { params: { year, month } });

export const getDashboardStats = () => api.get('/reports/dashboard');
