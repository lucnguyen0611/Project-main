import { apiClient } from "./axios";
import { API_ENDPOINTS } from "@/constants/api.constants";
import type {
    ApiExamResult,
    CreateExamResultRequest,
    UpdateExamResultRequest
} from "@/types";

export const examResultApi = {
    getByStudentAndExamGroup: async (
        studentId: number | string,
        examGroupId: number | string
    ): Promise<ApiExamResult[]> => {
        const qStudent = encodeURIComponent(String(studentId));
        const qExamGroup = encodeURIComponent(String(examGroupId));

        const res = await apiClient.get<ApiExamResult[]>(
            `/exam_results/?student_id=${qStudent}&exam_group_id=${qExamGroup}`
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
        payload: UpdateExamResultRequest
    ) => {
        const res = await apiClient.put(
            `${API_ENDPOINTS.EXAM_RESULT_UPDATE.replace(":id", id.toString())}`,
            payload
        );
        return res.data;
    },
};
