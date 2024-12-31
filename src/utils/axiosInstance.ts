import axios, { AxiosInstance } from 'axios';

// Create and type the axios instance
export const axiosInstance: AxiosInstance = axios.create({
    baseURL: 'http://localhost:8080/astrobandhan/v1', // Base URL for your API
});

export default axiosInstance;