import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:5000/api'; 

const api = axios.create({
  baseURL: API_BASE_URL,
});
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (username, email, password) => 
    api.post('/auth/register', { username, email, password }),
};
export const messagesAPI = {
  getRooms: () => api.get('/messages'),
  getMessages: (roomId) => api.get(`/messages/${roomId}`),
};

export default api;