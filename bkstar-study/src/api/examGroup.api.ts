import { apiClient } from "./axios";
import { API_ENDPOINTS } from "@/constants/api.constants";
import type {CreateExamResponse, CreateEamRequest, ExamGroup} from "@/types";

export const examGroupApi = {
    getExamGroup: async (id: number): Promise<ExamGroup> => {
        const response = await apiClient.get<ExamGroup>(
            `${API_ENDPOINTS.EXAM_GROUP_DETAIL.replace(":id", id.toString())}`
        );
        return response.data;
    },

    getExamGroupByClassId: async (classId: number | string) => {
        const res = await apiClient.get(`/exam_groups?class_id=${encodeURIComponent(String(classId))}`);
        return res.data;
    },

    createExamGroup: async (
        data: CreateEamRequest
    ): Promise<CreateExamResponse> => {
        const response = await apiClient.post(
            API_ENDPOINTS.EXAM_GROUP_CREATE,
            data
        );
        return response.data;
    },

    // Update user profile
    updateExamGroup: async (
        id: number,
        data: ExamGroup
    ): Promise<ExamGroup> => {
        const response = await apiClient.put<ExamGroup>(
            `${API_ENDPOINTS.EXAM_GROUP_UPDATE.replace(":id", id.toString())}`,
            data
        );
        return response.data;
    },

    deleteExamGroup: async (id: number): Promise<void> => {
        await apiClient.delete(`${API_ENDPOINTS.EXAM_GROUP_DELETE}${id}/`);
    },
};
