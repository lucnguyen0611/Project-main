import { apiClient } from "./axios";
import { API_ENDPOINTS } from "@/constants/api.constants";
import type {ExamItem} from "@/types";

export const examApi = {
    getExams: async (id: number | string) => {
        const res = await apiClient.get(`exams/?exam_group_id=${encodeURIComponent(String(id))}`);
        return res.data;
    },

    getExamById: async (id: number): Promise<ExamItem> => {
        const response = await apiClient.get<ExamItem>(
            `${API_ENDPOINTS.EXAM_DETAIL.replace(":id", id.toString())}`
        );
        return response.data;
    },

    createExam: async (
        data: ExamItem
    ): Promise<ExamItem> => {
        const response = await apiClient.post(
            API_ENDPOINTS.EXAM_CREATE,
            data
        );
        return response.data;
    },

    updateExam: async (
        id: number,
        data: ExamItem
    ): Promise<ExamItem> => {
        const response = await apiClient.put<ExamItem>(
            `${API_ENDPOINTS.EXAM_UPDATE.replace(":id", id.toString())}`,
            data
        );
        return response.data;
    },

    deleteExam: async (id: number): Promise<void> => {
        await apiClient.delete(`${API_ENDPOINTS.EXAM_DELETE}${id}/`);
    },
};
