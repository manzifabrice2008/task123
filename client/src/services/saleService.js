import api from '../api/axios';

export const getSales = (params) => api.get('/sales', { params });
export const getAllSales = () => api.get('/sales/all');
export const getSale = (id) => api.get(`/sales/${id}`);
export const createSale = (data) => api.post('/sales', data);
export const deleteSale = (id) => api.delete(`/sales/${id}`);
