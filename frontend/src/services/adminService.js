// frontend/src/services/adminService.js
import api from './api';

const AdminService = {
  // Get total users count and statistics
  getUsersCount: async () => {
    const response = await api.get('/admin/users/count');
    return response.data;
  },

  // Get dashboard statistics
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  },

  // Get list of users with pagination
  getUsersList: async (page = 1, limit = 10, filters = {}) => {
    const { role, isVerified, sortBy, sortOrder } = filters;
    
    const queryParams = new URLSearchParams();
    queryParams.append('page', page);
    queryParams.append('limit', limit);
    
    if (role) queryParams.append('role', role);
    if (isVerified !== undefined) queryParams.append('isVerified', isVerified);
    if (sortBy) queryParams.append('sortBy', sortBy);
    if (sortOrder) queryParams.append('sortOrder', sortOrder);
    
    const response = await api.get(`/admin/users?${queryParams.toString()}`);
    return response.data;
  },

  // Get user details
  getUserDetails: async (userId) => {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
  },

  // Update user
  updateUser: async (userId, userData) => {
    const response = await api.put(`/admin/users/${userId}`, userData);
    return response.data;
  },

  // Delete user
  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  // Get user modification history
  getModificationHistory: async (page = 1, limit = 10, userId = null) => {
    const queryParams = new URLSearchParams();
    queryParams.append('page', page);
    queryParams.append('limit', limit);
    
    if (userId) queryParams.append('userId', userId);
    
    const response = await api.get(`/admin/users/modification-history?${queryParams.toString()}`);
    return response.data;
  }
};

export default AdminService;