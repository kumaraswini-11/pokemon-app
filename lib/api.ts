import axios, {AxiosInstance, AxiosResponse} from "axios";

import {POKEMON_BASE_URL} from "@/constants";

export const api: AxiosInstance = axios.create({
  baseURL: POKEMON_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Generic API response type
export interface ApiResponse<T> {
  data: T;
}

// Interceptors for request/response handling
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  error => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Generic GET request function
export const get = async <T>(
  url: string,
  params?: Record<string, unknown>
): Promise<ApiResponse<T>> => {
  const response = await api.get<T>(url, {params});
  return {data: response.data};
};
