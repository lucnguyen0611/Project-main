import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { API_CONFIG } from "@/config/api.config";
import { API_ENDPOINTS } from "@/constants/api.constants";
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  clearTokens,
} from "@/utils/storage.utils";
import { isTokenExpiringSoon } from "@/utils/jwt.utils";

export const API_URL = import.meta.env.VITE_API_URL as string;

class ApiClient {
  private instance: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (reason?: any) => void;
  }> = [];

  constructor() {
    this.instance = axios.create({
      // baseURL: API_CONFIG.baseURL,
      baseURL: API_URL,
      timeout: API_CONFIG.timeout,
      headers: API_CONFIG.headers,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    // Trước khi gửi request, lấy access token (getAccessToken()).
    // Nếu có token, kiểm tra token sắp hết hạn (isTokenExpiringSoon(token, 5)):
    // nếu đúng — gọi refreshTokenIfNeeded() để refresh trước khi gửi request.
    // Sau đó lấy (lại) getAccessToken() và set config.headers.Authorization = Bearer ${token}.
    this.instance.interceptors.request.use(
      async (config) => {
        const token = getAccessToken();
        if (token) {
          // Kiểm tra nếu token sắp hết hạn (< 5 phút)
          if (isTokenExpiringSoon(token, 5)) {
            // Thử refresh token trước khi gửi request
            await this.refreshTokenIfNeeded();
          }

          const currentToken = getAccessToken();
          if (currentToken) {
            config.headers.Authorization = `Bearer ${currentToken}`;
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    // Xử lý trả về hoặc lỗi từ server.
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        // Xử lý lỗi 401 (Unauthorized)
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // Nếu đang refresh, đưa request vào queue
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return this.instance(originalRequest);
              })
              .catch((err) => {
                return Promise.reject(err);
              });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          const refreshToken = getRefreshToken();
          if (!refreshToken) {
            this.clearAuth();
            return Promise.reject(error);
          }

          try {
            // Gửi POST /login/get_new_token/ để lấy token mới
            const response = await this.instance.post(
              API_ENDPOINTS.REFRESH_TOKEN,
              {
                refreshToken: refreshToken,
              }
            );

            const { access, refresh } = response.data;

            // Cập nhật token mới vào cookie/memory
            setAccessToken(access);
            if (refresh) {
              setRefreshToken(refresh);
            }

            // Cập nhật header mặc định
            this.instance.defaults.headers.common.Authorization = `Bearer ${access}`;
            originalRequest.headers.Authorization = `Bearer ${access}`;

            // Xử lý queue và retry các request bị delay
            this.processQueue(null, access);
            this.isRefreshing = false;

            // Retry request gốc
            return this.instance(originalRequest);
          } catch (refreshError) {
            // Nếu refresh thất bại (401/403)
            this.processQueue(refreshError, null);
            this.isRefreshing = false;
            this.clearAuth();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Lặp failedQueue, gọi resolve(token) nếu không có error, hoặc reject(error) nếu có error.
  // Sau đó set failedQueue = [].
  private processQueue(error: any, token: string | null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });

    this.failedQueue = [];
  }

  // Kiểm tra isRefreshing rồi lấy refreshToken. Nếu không có refresh token -> trả false.
  // Đánh dấu isRefreshing = true.
  // Gọi POST /login/get_new_token/ (lưu ý endpoint khác so với API_ENDPOINTS.REFRESH_TOKEN ở nơi khác — inconsistency).
  // Nếu thành công: set access/refresh, cập nhật header mặc định, set isRefreshing = false, return true.
  // Nếu thất bại: set isRefreshing = false, clearAuth(), return false.
  private async refreshTokenIfNeeded(): Promise<boolean> {
    if (this.isRefreshing) {
      return false;
    }

    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      return false;
    }

    this.isRefreshing = true;

    try {
      // Gửi POST /login/get_new_token/ để lấy token mới
      const response = await this.instance.post("/auth/refresh/", {
        refreshToken: refreshToken,
      });

      const { accessToken } = response.data;

      // Cập nhật token mới vào cookie/memory
      setAccessToken(accessToken);
      if (refreshToken) {
        setRefreshToken(refreshToken);
      }

      // Cập nhật header mặc định
      this.instance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
      this.isRefreshing = false;
      return true;
    } catch (error) {
      this.isRefreshing = false;
      this.clearAuth();
      return false;
    }
  }

  private clearAuth() {
    // Xóa token trong cookie
    clearTokens();

    // Xóa thông tin user trong state (dispatch logout action)
    window.dispatchEvent(new CustomEvent("logout"));

    // Hiện toast "Phiên đã hết hạn"
    window.dispatchEvent(
      new CustomEvent("showToast", {
        detail: { message: "Phiên đã hết hạn", severity: "warning" },
      })
    );

    // Redirect về trang đăng nhập
    setTimeout(() => {
      window.location.href = "/auth/login";
    }, 1000);
  }

  public get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.get(url, config);
  }

  public post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.post(url, data, config);
  }

  public put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.put(url, data, config);
  }

  public delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.delete(url, config);
  }

  public patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.patch(url, data, config);
  }
}

export const apiClient = new ApiClient();
export default apiClient;
