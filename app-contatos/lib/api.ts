import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// => ajuste aqui para a sua API:
// - se for emulador Android (AVD): use 'http://10.0.2.2:3000'
// - iOS simulator: 'http://localhost:3000'
// - em um dispositivo físico: 'http://SEU_IP_LOCAL:3000'
const BASE_URL = Platform.select({
  ios: 'http://localhost:3000',
  android: 'http://10.0.2.2:3000',
  web: 'http://localhost:3000',
}) as string;

const api = axios.create({ baseURL: BASE_URL });

export async function setAuthToken(token: string) {
  await SecureStore.setItemAsync('token', token, { keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK });
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export async function loadAuthToken() {
  const token = await SecureStore.getItemAsync('token');
  if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  return token;
}

export async function clearAuthToken() {
  await SecureStore.deleteItemAsync('token');
  delete api.defaults.headers.common['Authorization'];
}

export function getImageUrl(fileId?: string) {
  return fileId ? `${BASE_URL}/upload/${fileId}` : undefined;
}

export default api;