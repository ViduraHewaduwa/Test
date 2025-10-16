import axios from "axios";
import API_URL from '../config/api';

const API_LAWYERS_URL = `${API_URL}/api/lawyers`;

export const getAllLawyers = async () => {
  try {
    const response = await axios.get(API_LAWYERS_URL);
    console.log("response of lawyeers  : ", response);
    return response.data; // list of lawyers
  } catch (error) {
    console.error("Error fetching lawyers:", error);
    throw error;
  }
};

