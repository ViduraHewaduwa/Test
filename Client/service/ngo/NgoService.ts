import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_URL from '../../config/api';

const NGO_API_URL = `${API_URL}/api/ngo`;

// Create axios instance
const api = axios.create({
    baseURL: NGO_API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

class NgoService {
    // Get NGO by email
    async getNgoByEmail(email: string) {
        try {
            const response = await api.get(`/by-email/${email}`);
            return {
                success: true,
                data: response.data.data
            };
        } catch (error: any) {
            console.error('Get NGO by email error:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch NGO data');
        }
    }

    // Get all NGOs with filters
    async getAllNgos(params?: {
        searchText?: string;
        page?: number;
        size?: number;
        category?: string;
    }) {
        try {
            const response = await api.get(`/all`, { params });
            return {
                success: true,
                data: response.data.data,
                pagination: response.data.pagination
            };
        } catch (error: any) {
            console.error('Get all NGOs error:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch NGOs');
        }
    }

    // Get NGO by ID
    async getNgoById(id: string) {
        try {
            const response = await api.get(`/${id}`);
            return {
                success: true,
                data: response.data.data
            };
        } catch (error: any) {
            console.error('Get NGO by ID error:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch NGO');
        }
    }

    // Update NGO
    async updateNgo(id: string, data: any) {
        try {
            const response = await api.put(`/${id}`, data);
            return {
                success: true,
                data: response.data.data
            };
        } catch (error: any) {
            console.error('Update NGO error:', error);
            throw new Error(error.response?.data?.message || 'Failed to update NGO');
        }
    }

    // Upload NGO images with FormData
    async updateNgoWithImages(id: string, formData: FormData) {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await axios.put(
                `${NGO_API_URL}/${id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`
                    },
                    timeout: 30000 // 30 seconds for file upload
                }
            );
            return {
                success: true,
                data: response.data.data
            };
        } catch (error: any) {
            console.error('Update NGO with images error:', error);
            throw new Error(error.response?.data?.message || 'Failed to update NGO');
        }
    }

    // Get top rated NGOs
    async getTopRatedNgos(limit: number = 5) {
        try {
            const response = await api.get(`/top-ratings`, {
                params: { limit }
            });
            return {
                success: true,
                data: response.data.data
            };
        } catch (error: any) {
            console.error('Get top rated NGOs error:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch top NGOs');
        }
    }

    // Get NGOs by category
    async getNgosByCategory(category: string, limit: number = 10) {
        try {
            const response = await api.get(`/category/${category}`, {
                params: { limit }
            });
            return {
                success: true,
                data: response.data.data
            };
        } catch (error: any) {
            console.error('Get NGOs by category error:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch NGOs');
        }
    }

    // Update NGO status (admin only)
    async updateNgoStatus(id: string, status: 'active' | 'inactive') {
        try {
            const response = await api.patch(`/${id}/status`, { status });
            return {
                success: true,
                data: response.data.data
            };
        } catch (error: any) {
            console.error('Update NGO status error:', error);
            throw new Error(error.response?.data?.message || 'Failed to update status');
        }
    }

    // Delete NGO (admin only)
    async deleteNgo(id: string) {
        try {
            const response = await api.delete(`/${id}`);
            return {
                success: true,
                data: response.data.data
            };
        } catch (error: any) {
            console.error('Delete NGO error:', error);
            throw new Error(error.response?.data?.message || 'Failed to delete NGO');
        }
    }
    async uploadNgoLogo(ngoId: string, formData: FormData) {
        try {
            const response = await axios.put(
                `${NGO_API_URL}/${ngoId}/logo`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            return { success: true, data: response.data };
        } catch (error: any) {
            throw new Error(error.response?.data?.error || 'Failed to upload logo');
        }
    }

// Upload NGO Images (add to existing images)
    async uploadNgoImages(ngoId: string, formData: FormData) {
        try {
            const response = await axios.post(
                `${NGO_API_URL}/${ngoId}/images`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            return { success: true, data: response.data };
        } catch (error: any) {
            throw new Error(error.response?.data?.error || 'Failed to upload images');
        }
    }

// Delete specific NGO image
    async deleteNgoImage(ngoId: string, imageUrl: string) {
        try {
            const response = await axios.delete(
                `${NGO_API_URL}/${ngoId}/images`,
                {
                    data: { imageUrl }
                }
            );
            return { success: true, data: response.data };
        } catch (error: any) {
            throw new Error(error.response?.data?.error || 'Failed to delete image');
        }
    }

// Delete all NGO images
    async deleteAllNgoImages(ngoId: string) {
        try {
            const response = await axios.delete(
                `${NGO_API_URL}/${ngoId}/images/all`
            );
            return { success: true, data: response.data };
        } catch (error: any) {
            throw new Error(error.response?.data?.error || 'Failed to delete all images');
        }
    }
}

export default new NgoService();