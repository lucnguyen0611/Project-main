import { apiClient } from "./axios";
import { API_ENDPOINTS } from "@/constants/api.constants";
import type {
    Class,
    CreateClassRequest,
    CreateClassResponse,
    // ClassListResponse,
} from "@/types/class.types";

export interface InviteI {
    class_id: number,
    user_id: number,
    code: string,
}

export const classApi = {
    // Get list of classes
    getClasses: async (): Promise<Class[]> => {
        const response = await apiClient.get<Class[]>(API_ENDPOINTS.CLASSES);
        return response.data;
    },

    // Get class by ID
    getClassById: async (id: number): Promise<Class> => {
        const response = await apiClient.get<Class>(
            `${API_ENDPOINTS.CLASSES}${id}/`
        );
        return response.data;
    },

    // Create new class
    createClass: async (
        data: CreateClassRequest
    ): Promise<CreateClassResponse> => {
        const response = await apiClient.post<CreateClassResponse>(
            API_ENDPOINTS.CLASSES,
            data
        );
        return response.data;
    },

    // Update class
    updateClass: async (
        id: number,
        data: Partial<CreateClassRequest>
    ): Promise<Class> => {
        const response = await apiClient.put<Class>(
            `${API_ENDPOINTS.CLASSES}${id}/`,
            data
        );
        return response.data;
    },

    // Delete class
    deleteClass: async (id: number): Promise<void> => {
        await apiClient.delete(`${API_ENDPOINTS.CLASSES}${id}/`);
    },

    invite: async (
        data: InviteI
    ) => {
        const response = await apiClient.post(
            'invitations',
            data
        );
        return response.data;
    },
};
