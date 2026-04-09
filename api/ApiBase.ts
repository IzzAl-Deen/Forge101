import { supabase } from "@/lib/supabase";
import axios from "axios";

const apiBase = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1",
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

apiBase.interceptors.request.use(async (config) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
    console.log(session.access_token);
  }
  return config;
});

export default apiBase;
