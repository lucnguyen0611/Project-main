import { apiClient } from "./axios";
import { API_ENDPOINTS } from "@/constants/api.constants";
import type {
  ProfileData,
  UpdateProfileRequest,
  ChangePasswordRequest,
} from "@/types/profile.types";

export const profileApi = {
  // Get user profile
  getProfile: async (userId: number): Promise<ProfileData> => {
    const response = await apiClient.get<ProfileData>(
      `${API_ENDPOINTS.UPDATE_PROFILE.replace(":id", userId.toString())}`
    );
    return response.data;
  },

  // Update user profile
  updateProfile: async (
    userId: number,
    data: UpdateProfileRequest
  ): Promise<ProfileData> => {
    const response = await apiClient.put<ProfileData>(
      `${API_ENDPOINTS.UPDATE_PROFILE.replace(":id", userId.toString())}`,
      data
    );
    return response.data;
  },

  // Change password
  changePassword: async (
    data: ChangePasswordRequest
  ): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(
      API_ENDPOINTS.CHANGE_PASSWORD,
      data
    );
    return response.data;
  },
};
