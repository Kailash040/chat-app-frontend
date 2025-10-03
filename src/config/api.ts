import Constants from 'expo-constants';

// Adjust this if your backend runs on a different host/port or in LAN
const DEFAULT_BASE_URL = 'http://127.0.0.1:4000';

export const API_BASE_URL: string =
  (Constants.expoConfig?.extra as any)?.API_BASE_URL || DEFAULT_BASE_URL;

export const SOCKET_URL: string =
  (Constants.expoConfig?.extra as any)?.SOCKET_URL || API_BASE_URL;


