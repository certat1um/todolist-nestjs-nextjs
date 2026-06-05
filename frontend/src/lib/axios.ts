import { env } from "@/src/env";
import axios, { AxiosResponse } from "axios";
import { ApiSuccessResponse, ApiExceptionResponse } from "../types/api";

export const api = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (res: AxiosResponse<ApiSuccessResponse<unknown>>) => res,
  (err) => {
    const apiError = err.response?.data as ApiExceptionResponse | undefined;

    const message = apiError?.message ?? err.message ?? "Something went wrong";
    const errors = apiError?.errors;

    const error = new Error(message) as Error & {
      errors?: unknown[];
      statusCode?: number;
    };

    error.errors = errors;
    error.statusCode = err.response?.status;

    return Promise.reject(error);
  },
);

export default {
  get: <T>(url: string, config?: Parameters<typeof api.get>[1]) =>
    api.get<ApiSuccessResponse<T>>(url, config).then((r) => r.data),

  post: <T>(
    url: string,
    data?: unknown,
    config?: Parameters<typeof api.post>[2],
  ) => api.post<ApiSuccessResponse<T>>(url, data, config).then((r) => r.data),

  patch: <T>(
    url: string,
    data?: unknown,
    config?: Parameters<typeof api.patch>[2],
  ) => api.patch<ApiSuccessResponse<T>>(url, data, config).then((r) => r.data),

  delete: <T>(url: string, config?: Parameters<typeof api.delete>[1]) =>
    api.delete<ApiSuccessResponse<T>>(url, config).then((r) => r.data),
};
