import ApiClient from "../api-client";
import { API_URL } from "../environment";

export const getBrand = async (brandId, dispatch = null) => {
  const response = await ApiClient.get(`${API_URL}/brands/${brandId}`, {}, null, dispatch);
  return response;
};

export const updateBrand = async (brandId, payload, dispatch = null) => {
  const response = await ApiClient.put(`${API_URL}/brands/${brandId}`, payload, null, dispatch);
  return response;
};
