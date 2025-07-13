import axios, { type AxiosRequestConfig, AxiosError } from 'axios';
import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import { getAuthContainer } from '@/modules/Auth';

export const BASE_API_URL = import.meta.env.VITE_BACKEND_URL;

console.log('BASE_API_URL', BASE_API_URL);

const InterviewerApi = axios.create({
  baseURL: BASE_API_URL,
});

InterviewerApi.interceptors.request.use(
  async (config) => {
    const authContainer = getAuthContainer();
    if (!authContainer?.user?.id_token) {
      throw new Error('Auth configuration failed');
    }
    const token = authContainer.user.id_token;
    config.headers.set('Authorization', `Bearer ${token}`);
    return config;
  },
  (error) => Promise.reject(error),
);

InterviewerApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if ([401, 403].includes(error.response?.status)) {
      console.warn('Unauthorized - signing out...');
      const authContainer = getAuthContainer();
      if (!authContainer) {
        throw new Error('Auth configuration failed');
      }
      authContainer?.signoutSilent();
      window.location.href = '/'; // або redirect на login
    }
    return Promise.reject(error);
  },
);

export const interviewBaseQuery =
  (): BaseQueryFn<{
    url: string;
    method: AxiosRequestConfig['method'];
    body?: AxiosRequestConfig['data'];
    params?: AxiosRequestConfig['params'];
  }> =>
  async ({ url, method, body, params }) => {
    try {
      const result = await InterviewerApi.request({
        url,
        method,
        data: body,
        params,
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status || 500,
          data: err.response?.data || err.message,
        },
      };
    }
  };

export default InterviewerApi;
