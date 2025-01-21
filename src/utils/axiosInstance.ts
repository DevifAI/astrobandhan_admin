import axios, { AxiosInstance } from 'axios';

// Create and type the axios instance
export const axiosInstance: AxiosInstance = axios.create({
    baseURL: 'https://www.devifai.in/astrobandhan/v1', // Base URL for your API
});

export default axiosInstance;

