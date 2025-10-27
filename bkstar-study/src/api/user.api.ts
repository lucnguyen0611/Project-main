import { apiClient } from "./axios";
import { API_ENDPOINTS } from "@/constants/api.constants";
import type {
  UserProfile,
  UpdateProfileRequest,
  ChangePasswordRequest,
  ChangePasswordResponse,
} from "@/types/user.types";

export const userApi = {
  // Get user profile
  getUserProfile: async (id: number): Promise<UserProfile> => {
    const response = await apiClient.get<UserProfile>(
      `${API_ENDPOINTS.UPDATE_PROFILE.replace(":id", id.toString())}`
    );
    return response.data;
  },

  // Update user profile
  updateProfile: async (
    id: number,
    data: UpdateProfileRequest
  ): Promise<UserProfile> => {
    const response = await apiClient.put<UserProfile>(
      `${API_ENDPOINTS.UPDATE_PROFILE.replace(":id", id.toString())}`,
      data
    );
    return response.data;
  },

  // Change password
  changePassword: async (
    data: ChangePasswordRequest
  ): Promise<ChangePasswordResponse> => {
    const response = await apiClient.post<ChangePasswordResponse>(
      API_ENDPOINTS.CHANGE_PASSWORD,
      data
    );
    return response.data;
  },
};
