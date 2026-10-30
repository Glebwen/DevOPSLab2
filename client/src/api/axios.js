import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: '/',
  withCredentials: true,
});

api.interceptors.request.use(config => {
  const token = Cookies.get('csrftoken');
  if (token) {
    config.headers['X-CSRFToken'] = token;
  }
  return config;
});

export default api;