import { API_BASE_URL } from "@/constants/api.constants";

export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased timeout for token refresh
  headers: {
    "Content-Type": "application/json",
  },
} as const;

export const COOKIE_CONFIG = {
  accessToken: {
    name: "access_token",
    httpOnly: false, // Changed to false so js-cookie can access it
  },
  refreshToken: {
    name: "refresh_token",
    httpOnly: false, // Changed to false so js-cookie can access it
  },
} as const;
