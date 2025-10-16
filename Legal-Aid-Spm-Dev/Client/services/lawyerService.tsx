import axios from "axios";
import { Platform } from 'react-native';
import { getApiBaseUrl, API_ENDPOINTS } from '../config/api.config';

// Get API URL based on platform using centralized config
const API_URL = getApiBaseUrl(Platform.OS as any) + API_ENDPOINTS.LAWYERS;

export const getAllLawyers = async () => {
  try {
    const response = await axios.get(API_URL);
    console.log("response of lawyeers  : ", response);
    return response.data; // list of lawyers
  } catch (error) {
    console.error("Error fetching lawyers:", error);
    throw error;
  }
};

