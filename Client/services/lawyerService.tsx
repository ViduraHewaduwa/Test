import axios from "axios";
import { API_URL_ENV } from '@env';

// 👇 change to your backend URL
const API_URL = `${API_URL_ENV}/api/lawyers`; 
// If using device/emulator, use your machine's IP instead of localhost.

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

