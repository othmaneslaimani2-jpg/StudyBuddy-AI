import axios, { InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';

// Set to current host machine LAN IP (192.168.1.63) or 10.0.2.2 for Android emulator
const API_BASE_URL = 'http://192.168.1.63:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    let token: string | null = null;
    try {
      const { useAuthStore } = require('../store/authStore');
      token = useAuthStore.getState().userToken;
    } catch {
      // ignore
    }
    if (!token) {
      token = await SecureStore.getItemAsync('userToken');
    }
    if (token && config.headers) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
