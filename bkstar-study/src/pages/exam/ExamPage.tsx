import React, { useCallback, useEffect, useState } from "react";
import { Box, Alert } from "@mui/material";
import { useParams, useNavigate, Outlet, useLocation } from "react-router-dom";
import { examGroupApi } from "@/api/examGroup.api";
import { examApi } from "@/api/exam.api";
import CreatExamGroupDialog from "@/components/dialog/CreatExamGroupDialog.tsx";
import { LoadingData } from "@/components/common/LoadingData";
import { ExamHeader, ExamGrid, ResultGroup } from "@/components/exam";
import type { ExamGroup, ExamItem } from "@/types";
import { useAuth, useToast } from "@/contexts";

const ExamPage: React.FC = () => {
    const { classId, examGroupId } = useParams<{ classId: string; examGroupId: string }>();
    const groupId = Number(examGroupId);
    const navigate = useNavigate();
    const location = useLocation();

    const { isTeacher } = useAuth();
    const { showToast } = useToast();

    const [examGroup, setExamGroup] = useState<ExamGroup | null>(null);
    const [exams, setExams] = useState<ExamItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogLoading, setDialogLoading] = useState(false);

    const fetchExamGroup = useCallback(async (id: number) => {
        try {
            const res = await examGroupApi.getExamGroup(id);
            setExamGroup(res);
        } catch (err) {
            console.error("Không thể lấy thông tin nhóm bài thi:", err);
            setError("Không thể tải thông tin nhóm bài thi.");
        }
    }, []);

    const fetchExams = useCallback(async (id: number) => {
        try {
            const res = await examApi.getExams(id);
            setExams(res);
        } catch (err) {
            console.error("Không thể lấy danh sách bài thi:", err);
            setError("Không thể tải danh sách bài thi.");
        }
    }, []);

    useEffect(() => {
        setExamGroup(null);
        setExams([]);
        setError(null);
        setLoading(true);

        if (!isFinite(groupId) || groupId <= 0) {
            setError("ID nhóm bài thi không hợp lệ.");
            setLoading(false);
            return;
        }

        const load = async () => {
            await Promise.all([fetchExamGroup(groupId), fetchExams(groupId)]);
            setLoading(false);
        };
        void load();
    }, [groupId, fetchExamGroup, fetchExams]);

    const students = (examGroup?.users ?? []).map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
    }));

    const handleEditGroup = () => setDialogOpen(true);

    // payload.awaitTime expected in seconds
    const handleUpdateGroup = async (payload: { name: string; startDate: string; awaitTime: number }) => {
        setDialogLoading(true);
        try {
            await (examGroupApi as any).updateExamGroup?.(groupId, {
                name: payload.name,
                class_id: classId,
                start_time: payload.startDate,
                await_time: Number(payload.awaitTime), // seconds
                is_once: true,
                is_save_local: true,
            });
            await fetchExamGroup(groupId);
            showToast("Cập nhật nhóm bài thi thành công!", "success");
            setDialogOpen(false);
        } catch (err) {
            console.error("Cập nhật nhóm thất bại:", err);
            showToast("Cập nhật nhóm bài thi thất bại!", "success");
        } finally {
            setDialogLoading(false);
            setDialogOpen(false);
        }
    };

    const handleDeleteGroup = async () => {
        try {
            await (examGroupApi as any).deleteExamGroup?.(groupId);
            showToast("Xóa nhóm bài thi thành công!", "success");
            navigate(-1);
        } catch (err) {
            console.error("Xóa nhóm thất bại:", err);
            showToast("Xóa nhóm bài thi thất bại!", "error");
        } finally {
            setDialogLoading(false);
            setDialogOpen(false);
        }
    };

    if (loading) return <LoadingData />;

    if (error) {
        return (
            <Box p={2}>
                <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
            </Box>
        );
    }

    if (!examGroup) {
        return (
            <Box p={2}>
                <Alert severity="warning">Không tìm thấy thông tin nhóm bài thi.</Alert>
            </Box>
        );
    }

    return (
        <Box p={2}>
            <ExamHeader
                examGroup={examGroup}
                onEdit={handleEditGroup}
                isTeacher={isTeacher}
            />

            <ExamGrid
                classId={classId}
                groupId={groupId}
                exams={exams}
                isTeacher={isTeacher}
                onReload={() => void fetchExams(groupId)}
            />

            {isTeacher && (
                <ResultGroup
                    students={students}
                    onViewDetail={(studentId) => {
                        navigate(`${location.pathname}/markingStudent/${studentId}`);
                    }}
                />
            )}

            <CreatExamGroupDialog
                isOpen={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onSubmit={handleUpdateGroup}
                isLoading={dialogLoading}
                initialData={{
                    name: examGroup.name,
                    // examGroup.await_time is seconds in backend; pass it directly
                    awaitTime: examGroup.await_time ?? 0,
                    startDate: (examGroup.start_time ?? new Date().toISOString().split("T")[0]).split("T")[0],
                }}
                dialogTitle="Chỉnh sửa bài thi"
                mode="edit"
                onDelete={handleDeleteGroup}
            />

            <Outlet />
        </Box>
    );
};

export default ExamPage;
