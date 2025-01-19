import axios, { AxiosInstance } from 'axios';

// Create and type the axios instance
export const axiosInstance: AxiosInstance = axios.create({
    baseURL: 'https://ec2-15-206-90-111.ap-south-1.compute.amazonaws.com/astrobandhan/v1', // Base URL for your API
});

export default axiosInstance;

