import axiosInstance from '../utils/axiosInstance';

export const createCategoryAPI = (formData: FormData) => {
  return axiosInstance.post('/productCategory/create', formData);
};

export const updateCategoryAPI = (formData: FormData, id: any) => {
  return axiosInstance.put(`/productCategory/update/${id}`, formData);
};
