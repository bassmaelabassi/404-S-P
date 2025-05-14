// frontend/src/services/userService.js
import api from './api';

const UserService = {
  // Get current user profile
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Update profile details
  updateProfile: async (userData) => {
    const response = await api.put('/users/profile', userData);
    
    // Update local storage user data if needed
    if (response.data.user) {
      const currentUser = JSON.parse(localStorage.getItem('user'));
      const updatedUser = { ...currentUser, ...response.data.user };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
    
    return response.data;
  },

  // Change user password
  changePassword: async (currentPassword, newPassword) => {
    const response = await api.put('/users/change-password', {
      currentPassword,
      newPassword
    });
    return response.data;
  },

  // Update email address
  updateEmail: async (email) => {
    const response = await api.put('/users/update-email', { email });
    
    // Update local storage user data
    if (response.data.email) {
      const currentUser = JSON.parse(localStorage.getItem('user'));
      const updatedUser = { ...currentUser, email: response.data.email };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
    
    return response.data;
  },

  // Update phone number
  updatePhone: async (phone) => {
    const response = await api.put('/users/update-phone', { phone });
    
    if (response.data.phone) {
      const currentUser = JSON.parse(localStorage.getItem('user'));
      const updatedUser = { ...currentUser, phone: response.data.phone };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
    
    return response.data;
  }
};

export default UserService;