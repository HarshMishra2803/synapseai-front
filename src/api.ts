import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('synapse_token');
  if (token) {
    config.headers['authorization'] = token;
  }
  return config;
});

// ===== AUTH =====
export const signup = (username: string, password: string) =>
  api.post('/api/v1/signup', { username, password });

export const signin = (username: string, password: string) =>
  api.post('/api/v1/signin', { username, password });

// ===== CONTENT =====
export const getContent = () =>
  api.get('/api/v1/content');

export const createContent = (data: { title: string; link?: string; type?: string; tags?: string[]; note?: string }) =>
  api.post('/api/v1/content', data);

export const deleteContent = (contentId: string) =>
  api.delete('/api/v1/content', { data: { contentId } });

export const updateContent = (id: string, data: { title: string; note?: string; tags?: string[] }) =>
  api.put(`/api/v1/content/${id}`, data);

export const pinContent = (id: string) =>
  api.patch(`/api/v1/content/${id}/pin`);

export const aiSummarize = (data: { title: string; note?: string; link?: string; type?: string }) =>
  api.post('/api/v1/ai/summarize', data);

// ===== BRAIN SHARE =====
export const shareBrain = (share: boolean) =>
  api.post('/api/v1/brain/share', { share });

export const getSharedBrain = (shareLink: string) =>
  api.get(`/api/v1/brain/${shareLink}`);

export default api;
