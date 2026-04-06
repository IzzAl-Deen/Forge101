import axios, { AxiosHeaders } from "axios";

import { supabase } from "@/lib/supabase";

const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000/api/v1",
  timeout: 15000,
});

apiClient.interceptors.request.use(async (config) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const headers = AxiosHeaders.from(config.headers);

  headers.set("Accept", "application/json");

  if (session?.access_token) {
    headers.set("Authorization", `Bearer ${session.access_token}`);
  }

  config.headers = headers;

  return config;
});

export default apiClient;
