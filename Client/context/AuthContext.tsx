import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import API_URL from '../config/api';

interface User {
  id: string;
  email: string;
  role: 'user' | 'lawyer' | 'ngo';
  status: string;
  createdAt: string;
  updatedAt?: string;
  // User-specific fields
  birthday?: string;
  genderSpectrum?: string;
  // Lawyer-specific fields
  firstName?: string;
  lastName?: string;
  specialization?: string;
  contactNumber?: string;
  // NGO-specific fields
  organizationName?: string;
  description?: string;
  category?: string;
  logo?: string;
  contact?: string;
  images?: string[];
  rating?: number;
}

interface RegisterData {
  email: string;
  password: string;
  role: 'user' | 'lawyer' | 'ngo';
  // User-specific fields
  birthday?: string;
  genderSpectrum?: string;
  // Lawyer-specific fields
  firstName?: string;
  lastName?: string;
  specialization?: string;
  contactNumber?: string;
  // NGO-specific fields
  organizationName?: string;
  description?: string;
  category?: string;
  logo?: string;
  contact?: string;
  images?: string[];
}

interface ProfileData {
  // User-specific fields
  birthday?: string;
  genderSpectrum?: string;
  // Lawyer-specific fields
  firstName?: string;
  lastName?: string;
  specialization?: string;
  contactNumber?: string;
  // NGO-specific fields
  organizationName?: string;
  description?: string;
  category?: string;
  logo?: string;
  contact?: string;
  images?: string[];
  status?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  register: (userData: RegisterData) => Promise<{ success: boolean; user: User }>;
  login: (email: string, password: string) => Promise<{ success: boolean; user: User }>;
  logout: () => Promise<void>;
  getCurrentUser: (authToken?: string) => Promise<User>;
  updateProfile: (profileData: ProfileData) => Promise<{ success: boolean; user: User }>;
  // Role-based helper functions
  isUser: () => boolean;
  isLawyer: () => boolean;
  isNgo: () => boolean;
  hasRole: (role: 'user' | 'lawyer' | 'ngo') => boolean;
  getUserDisplayName: () => string;
  getUserTypeLabel: () => string;
  getProfileRoute: () => string;
  isProfileComplete: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  // Use centralized API configuration
  const API_BASE_URL = `${API_URL}/api/auth`;
  
  console.log('[AuthContext] Using API URL:', API_BASE_URL);

  // Configure axios interceptor
  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, [token]);

  const logout = React.useCallback(async (): Promise<void> => {
    try {
      console.log('[AuthContext] Starting logout process...');
      console.log('[AuthContext] Current auth state - isAuthenticated:', isAuthenticated, 'user:', !!user);
      
      // Clear stored token
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userRole');
      console.log('[AuthContext] Token removed from storage');
      
      // Clear context state
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setHasCheckedAuth(false); // Reset flag to allow re-checking auth state
      
      console.log('[AuthContext] Auth state cleared - isAuthenticated set to false');
      console.log('[AuthContext] Logout completed successfully');
    } catch (error) {
      console.error('[AuthContext] Logout error:', error);
      // Even if there's an error clearing storage, we should still clear the context state
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setHasCheckedAuth(false);
    }
  }, [isAuthenticated, user]);

  const getCurrentUser = React.useCallback(async (authToken: string = token || ''): Promise<User> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      if (response.data.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return response.data.user;
      }
      throw new Error('Failed to get user profile');
    } catch (err) {
      const error = err as any;
      console.error('Error getting current user:', error?.response?.data || error?.message || error);
      logout();
      throw err;
    }
  }, [token, logout, API_BASE_URL]);

  const checkAuthState = React.useCallback(async () => {

    const storedToken = await AsyncStorage.getItem('userToken');
const storedRole = await AsyncStorage.getItem('userRole');
if (storedToken && storedRole) {
  setToken(storedToken);
  setUser(prev => prev ? { ...prev, role: storedRole as User['role'] } : null);
}
    // Prevent multiple executions
    if (hasCheckedAuth) {
      return;
    }
    
    try {
      console.log('[AuthContext] checkAuthState: Checking authentication state...');
      const storedToken = await AsyncStorage.getItem('userToken');
      
      if (storedToken) {
        console.log('[AuthContext] checkAuthState: Token found, validating...');
        setToken(storedToken);
        try {
          await getCurrentUser(storedToken);
          console.log('[AuthContext] checkAuthState: User authenticated successfully');
        } catch {
          console.log('[AuthContext] checkAuthState: Token validation failed, logging out');
          // If token is invalid, logout will be called from getCurrentUser
        }
      } else {
        console.log('[AuthContext] checkAuthState: No stored token, user not authenticated');
      }
    } catch (error) {
      console.error('[AuthContext] Error checking auth state:', error);
    } finally {
      setIsLoading(false);
      setHasCheckedAuth(true);
    }
  }, [hasCheckedAuth, getCurrentUser]);

  // Check for existing token on app start
  useEffect(() => {
  checkAuthState();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []); // ✅ only run once when app starts

  const register = async (userData: RegisterData): Promise<{ success: boolean; user: User }> => {
    try {
      console.log(`[AuthContext] Registering with ${API_BASE_URL}`);
      
      const response = await axios.post(`${API_BASE_URL}/register`, userData);
      
      if (response.data.success) {
        const { token: newToken, user: newUser } = response.data;
        await AsyncStorage.setItem('userToken', newToken);
        await AsyncStorage.setItem('userRole', newUser.role);
        setToken(newToken);
        setUser(newUser);
        setIsAuthenticated(true);
        setHasCheckedAuth(true);
        
        console.log('[AuthContext] Registration successful');
        return { success: true, user: newUser };
      }
      throw new Error('Registration failed');
    } catch (error: any) {
      console.error('[AuthContext] Registration error:', error.response?.data || error.message || error);
      const message = error.response?.data?.message || 'Registration failed - unable to connect to server';
      throw new Error(message);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; user: User }> => {
    try {
      console.log(`[AuthContext] Logging in with ${API_BASE_URL}`);
      
      const response = await axios.post(`${API_BASE_URL}/login`, {
        email,
        password
      });
      
      if (response.data.success) {
        const { token: newToken, user: newUser } = response.data;
        await AsyncStorage.setItem('userToken', newToken);
        await AsyncStorage.setItem('userRole', newUser.role);
        setToken(newToken);
        setUser(newUser);
        setIsAuthenticated(true);
        setHasCheckedAuth(true);
        
        console.log('[AuthContext] Login successful');
        return { success: true, user: newUser };
      }
      throw new Error('Login failed');
    } catch (error: any) {
      console.error('[AuthContext] Login error:', error.response?.data || error.message || error);
      const message = error.response?.data?.message || 'Login failed - unable to connect to server';
      throw new Error(message);
    }
  };

  const updateProfile = async (profileData: ProfileData): Promise<{ success: boolean; user: User }> => {
    try {
  // console.log('[AuthContext] updateProfile: profileData:', profileData);
      const response = await axios.put(`${API_BASE_URL}/profile`, profileData);
  // console.log('[AuthContext] updateProfile: API response:', response.data);
      if (response.data.success) {
        setUser(response.data.user);
        return { success: true, user: response.data.user };
      }
      throw new Error('Profile update failed');
    } catch (error: any) {
      console.error('Update profile error:', error.response?.data || error.message || error);
      const message = error.response?.data?.message || 'Profile update failed';
      throw new Error(message);
    }
  };

  // Role-based helper functions
  const isUser = (): boolean => {
    return user?.role === 'user';
  };

  const isLawyer = (): boolean => {
    return user?.role === 'lawyer';
  };

  const isNgo = (): boolean => {
    return user?.role === 'ngo';
  };

  const hasRole = (role: 'user' | 'lawyer' | 'ngo'): boolean => {
    return user?.role === role;
  };

  // Additional helper functions for role-based functionality
  const getUserDisplayName = (): string => {
    if (!user) return 'User';
    
    switch (user.role) {
      case 'lawyer':
        return user.firstName && user.lastName 
          ? `${user.firstName} ${user.lastName}`
          : user.email;
      case 'ngo':
        return user.organizationName || user.email;
      case 'user':
      default:
        return user.email;
    }
  };

  const getUserTypeLabel = (): string => {
    if (!user) return 'User';
    switch (user.role) {
      case 'user':
        return 'Regular User';
      case 'lawyer':
        return 'Legal Professional';
      case 'ngo':
        return 'NGO Representative';
      default:
        return 'User';
    }
  };

  const getProfileRoute = (): string => {
    if (!user) return 'UserProfile';
    
    switch (user.role) {
      case 'user':
        return 'UserProfile';
      case 'lawyer':
        return 'LawyerOwnProfile';
      case 'ngo':
        return 'NgoOwnProfile';
      default:
        return 'UserProfile';
    }
  };

  const isProfileComplete = (): boolean => {
    if (!user) return false;
    
    switch (user.role) {
      case 'user':
        return !!(user.birthday && user.genderSpectrum);
      case 'lawyer':
        return !!(user.firstName && user.lastName && user.specialization && user.contactNumber);
      case 'ngo':
        return !!(user.organizationName && user.description && user.category && user.contact);
      default:
        return false;
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated,
    register,
    login,
    logout,
    getCurrentUser,
    updateProfile,
    isUser,
    isLawyer,
    isNgo,
    hasRole,
    getUserDisplayName,
    getUserTypeLabel,
    getProfileRoute,
    isProfileComplete
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
