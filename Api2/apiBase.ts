import axios from 'axios';
import { supabase } from '@/lib/supabase'; 

const apiBase = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v1', 
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
} );

apiBase.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apiBase;
