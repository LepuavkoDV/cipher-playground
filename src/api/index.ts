import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://local.cipher.kiev.ua:9090/api/v1',
  timeout: 50000,
});

const api = {
  getStatus: async () => instance.get('/status'),
  getConnectedToken: async () => instance.get('/token/connected'),
  createSession: async () => instance.post('/ticket'),
  setSessionOptions: async (sessionId: string, options: any) => instance.put(`/ticket/${sessionId}/option`, options),
  loadKeystoreContainer: async (sessionId: string, options: any) => instance.put(`/ticket/${sessionId}/keyStore`, options),
  verifyKeystoreContainer: async (sessionId: string, keyStorePassword: string) => instance.put(`/ticket/${sessionId}/keyStore/verifier`, { keyStorePassword }),
};

export { api };
