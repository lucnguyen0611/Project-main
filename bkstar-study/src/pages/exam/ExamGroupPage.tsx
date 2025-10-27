import { useEffect, useState, useCallback } from "react";
import { Alert, Box } from "@mui/material";
import { useParams, Outlet } from "react-router-dom";
import { examGroupApi } from "@/api/examGroup.api";
import { useToast, useAuth } from "@/contexts";
import { ExamGroupGrid, ExamGroupHeader } from "@/components/exam";
import CreatExamGroupDialog from "@/components/dialog/CreatExamGroupDialog";
import type { ExamGroup } from "@/types";
import { LoadingData } from "@/components/common/LoadingData";

export default function ExamGroupPage() {
    const { classId: classIdParam } = useParams<{ classId?: string }>();
    const classId = Number(classIdParam ?? NaN);

    const { showToast } = useToast();
    const { user } = useAuth();
    const isTeacher = user?.role === "teacher" || user?.role === "admin";

    const [groups, setGroups] = useState<ExamGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isDialogLoading, setDialogLoading] = useState(false);

    const fetchGroups = useCallback(async () => {
        if (!isFinite(classId) || classId <= 0) {
            setError("classId không hợp lệ");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const res = await examGroupApi.getExamGroupByClassId(classId);
            setGroups(res ?? []);
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Không thể tải nhóm bài thi");
        } finally {
            setLoading(false);
        }
    }, [classId]);

    useEffect(() => {
        fetchGroups();
    }, [fetchGroups]);

    const handleCreate = async (payload: { name: string; startDate: string; awaitTime: number }) => {
        setDialogLoading(true);
        try {
            await examGroupApi.createExamGroup({
                name: payload.name,
                class_id: classId,
                start_time: payload.startDate,
                await_time: payload.awaitTime,
                is_once: true,
                is_save_local: true,
            });

            showToast?.("Tạo nhóm bài thi thành công");
            await fetchGroups();
            setDialogOpen(false);
        } catch (err: any) {
            console.error(err);
            showToast?.(err.message || "Tạo nhóm bài thi thất bại");
        } finally {
            setDialogLoading(false);
        }
    };

    const filtered = (groups || []).filter((g) =>
        g.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <LoadingData />;

    return (
        <Box>
            <ExamGroupHeader
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                isTeacher={isTeacher}
                onCreateClick={() => setDialogOpen(true)}
            />

            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            <ExamGroupGrid groups={filtered} searchTerm={searchTerm} />

            <CreatExamGroupDialog
                isOpen={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onSubmit={handleCreate}
                isLoading={isDialogLoading}
                mode="create"
                dialogTitle="Tạo nhóm bài thi"
            />

            <Outlet />
        </Box>
    );
}
