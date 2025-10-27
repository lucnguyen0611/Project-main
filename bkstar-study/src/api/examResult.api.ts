// src/api/examResult.api.ts
import { apiClient } from "./axios";
import { API_ENDPOINTS } from "@/constants/api.constants";
import type {
    ApiExamResult,
    CreateExamResultRequest
} from "@/types";

export const examResultApi = {
    getByStudentAndExamGroup: async (
        studentId: number | string,
        examGroupId: number | string
    ): Promise<ApiExamResult[]> => {
        const qStudent = encodeURIComponent(String(studentId));
        const qExamGroup = encodeURIComponent(String(examGroupId));

        const res = await apiClient.get<ApiExamResult[]>(
            `/exam_result/?student=${qStudent}&exam_group=${qExamGroup}`
        );
        return res.data;
    },

    createExamResult : async (
        payload: CreateExamResultRequest
    ): Promise<CreateExamResultRequest> => {
        const res = await apiClient.post<CreateExamResultRequest>(
            API_ENDPOINTS.EXAM_RESULT_CREATE,
            payload
        );
        return res.data;
    },

    updateExamReult: async (
        id: number,
        payload: CreateExamResultRequest
    ) => {
        const res = await apiClient.put(
            `${API_ENDPOINTS.EXAM_RESULT_UPDATE.replace(":id", id.toString())}`,
            payload
        );
        return res.data;
    },
};
