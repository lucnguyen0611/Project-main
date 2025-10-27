import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Alert, Box } from "@mui/material";
import type { Course } from "@/types/user.types";
import { classApi } from "@/api/class.api";
import Member from "@/components/member/Member";
import { useToast } from "@/contexts";
import {LoadingData} from "@/components/common/LoadingData.tsx";

export default function MemberPage(){
    const { classId: classIdParam } = useParams<{ classId?: string }>();
    const classId = Number(classIdParam ?? NaN);
    const { showToast } = useToast();

    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const loadClasses = async () => {
        if (!isFinite(classId) || classId <= 0) {
            setError("classId không hợp lệ");
            setCourse(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data = await classApi.getClassById(classId);
            setCourse(data ?? null);
        } catch (err: any) {
            console.error("Lỗi khi tải thông tin lớp:", err);
            setError(err.message || "Không thể tải thông tin lớp");
            showToast(err, "error");
            setCourse(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadClasses();
    }, [classId]);

    if (loading) {
        return (
            <LoadingData/>
        );
    }

    return (
        <Box>
            {/* Error Alert */}
            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                    onClose={() => setError(null)}
                >
                    {error}
                </Alert>
            )}

            <Member course={course ?? undefined} />
        </Box>
    );
}
