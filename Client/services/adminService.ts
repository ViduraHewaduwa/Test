import AsyncStorage from '@react-native-async-storage/async-storage';
import API_URL from '../config/api';

// Use the centralized API configuration
const ADMIN_API_URL = `${API_URL}/api/admin`;

class AdminService {
  async adminLogin(username: string, password: string) {
    try {
      const response = await fetch(`${ADMIN_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store admin token
      await AsyncStorage.setItem('adminToken', data.token);
      await AsyncStorage.setItem('adminData', JSON.stringify(data.admin));

      return data;
    } catch (error: any) {
      console.error('Admin login error:', error);
      throw error;
    }
  }

  async getDashboardStats() {
    try {
      const token = await AsyncStorage.getItem('adminToken');
      
      if (!token) {
        throw new Error('No admin token found');
      }

      const response = await fetch(`${ADMIN_API_URL}/stats`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch dashboard data');
      }

      return data;
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      throw error;
    }
  }

  async logout() {
    try {
      await AsyncStorage.removeItem('adminToken');
      await AsyncStorage.removeItem('adminData');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  async getAdminData() {
    try {
      const adminData = await AsyncStorage.getItem('adminData');
      return adminData ? JSON.parse(adminData) : null;
    } catch (error) {
      console.error('Get admin data error:', error);
      return null;
    }
  }

  async isLoggedIn() {
    try {
      const token = await AsyncStorage.getItem('adminToken');
      return !!token;
    } catch (error) {
      console.error('Check login status error:', error);
      return false;
    }
  }
}

export default new AdminService();