import { api } from '../lib/api';

export const authService = {
  async login(username, password) {
    const result = await api.post('/auth/login', { username, password });
    return result;
  },

  async refreshToken(token) {
    const result = await api.post('/auth/refresh', { refreshToken: token });
    return result.accessToken;
  },
};
