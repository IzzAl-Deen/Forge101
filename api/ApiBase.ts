import { supabase } from "@/lib/supabase";
import axios from "axios";
import { Platform } from "react-native";

const API_BASE_URL =
  Platform.OS === "android"
    ? "https://forge101-backend-main-h4u9nt.laravel.cloud/api/v1"
    : "https://forge101-backend-main-h4u9nt.laravel.cloud/api/v1";

const apiBase = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

apiBase.interceptors.request.use(async (config) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

export default apiBase;
