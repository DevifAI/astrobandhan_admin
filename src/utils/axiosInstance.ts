import axios, { AxiosInstance } from 'axios';

// Manually control environment
const isProduction = false; // Set to true for production

// Define base URLs
const baseURL = isProduction
  ? 'https://devifai.in/astrobandhan/v1'
  : 'http://localhost:8080/astrobandhan/v1';

// Create and export the axios instance
export const axiosInstance: AxiosInstance = axios.create({
  baseURL,
});

export default axiosInstance;
