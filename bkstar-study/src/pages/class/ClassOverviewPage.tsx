import { useCallback, useEffect, useState } from "react";
import {
    Box,
    Button,
    Grid,
    Paper,
    Typography,
    Tooltip,
    Alert,
} from "@mui/material";
import { ContentCopy as ContentCopyIcon } from "@mui/icons-material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PeopleIcon from "@mui/icons-material/People";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import { useParams } from "react-router-dom";
import RecentActivity from "@/components/recentActivity/RecentActivity";
import Member from "@/components/member/Member";
import type { ExamGroup } from "@/types/exam.types";
import type { Course } from "@/types/user.types";
import { classApi } from "@/api/class.api";
import { examGroupApi } from "@/api/examGroup.api";
import { LoadingData } from "@/components/common/LoadingData.tsx";
import { getConfirmedMemberCount } from "@/utils/class.utils";

export default function ClassOverviewPage() {
    const { classId: classIdParam } = useParams<{ classId?: string }>();
    const classId = Number(classIdParam ?? NaN);

    // initial course shape matches dữ liệu bạn đưa: students, teachers
    const initialCourse: Course = {
        id: 0,
        code: "",
        name: "",
        students: [],
        teachers: [],
    };

    const [course, setCourse] = useState<Course>(initialCourse);
    const [examGroups, setExamGroups] = useState<ExamGroup[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAll = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            // fetch course and exam groups in parallel
            const [courseData, examGroupsData] = await Promise.all([
                classApi.getClassById(classId),
                examGroupApi.getExamGroupByClassId(classId),
            ]);

            // Ensure we always set a course object with arrays
            const safeCourse: Course = {
                id: courseData?.id ?? initialCourse.id,
                code: courseData?.code ?? initialCourse.code,
                name: courseData?.name ?? initialCourse.name,
                students: Array.isArray(courseData?.students) ? courseData!.students : [],
                teachers: Array.isArray(courseData?.teachers) ? courseData!.teachers : [],
            };

            setCourse(safeCourse);
            setExamGroups(Array.isArray(examGroupsData) ? examGroupsData : []);
        } catch (err: any) {
            console.error("Error loading class overview:", err);
            setError("Không thể tải thông tin lớp học");
        } finally {
            setLoading(false);
        }
    }, [classId]);

    useEffect(() => {
        if (!Number.isNaN(classId)) {
            fetchAll();
        } else {
            setLoading(false);
            setError("Class id không hợp lệ");
        }
    }, [fetchAll, classId]);
    const teachersName: string = course.teachers
        .map((t) => t?.name ?? "")
        .filter(Boolean)
        .join(", ");

    const baseUrl: string = window.location.origin;
    // dùng đường dẫn invite theo class id (consistent với các chỗ khác)
    const linkToInvite = `${baseUrl}/invite/${course.id}`;
    const onCopyLink = () => {
        navigator.clipboard
            .writeText(linkToInvite)
            .then(() => {
                // nếu bạn có toast, gọi ở đây
                // showToast("Đã sao chép link lớp học!");
            })
            .catch((err) => {
                console.error("Failed to copy link to clipboard: ", err);
            });
    };

    if (loading) {
        return <LoadingData />;
    }

    return (
        <Box>
            {error ? (
                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                    onClose={() => setError(null)}
                >
                    {error}
                </Alert>
            ) : (
                <Grid>
                    <Grid size={{ xs: 12, lg: 8 }}>
                        {/* Header section */}
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                mb: 3,
                                borderRadius: 2,
                                backgroundColor: "#3498db",
                                color: "white",
                            }}
                        >
                            <Box>
                                <Box>
                                    <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
                                        <AssignmentIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                                        {course.name ?? "Tên lớp"}
                                    </Typography>

                                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                        Giáo viên: {teachersName || "Chưa có giáo viên"}
                                    </Typography>

                                    <Box
                                        sx={{ display: "flex", alignItems: "flex-end", mt: 2, gap: "10px" }}
                                    >
                                        <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                            Chia sẻ lớp học
                                        </Typography>

                                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                                            <Tooltip title={"Copy link mời vào lớp"} arrow>
                                                <Button
                                                    variant="outlined"
                                                    startIcon={<ContentCopyIcon />}
                                                    size="small"
                                                    sx={{
                                                        mt: 1,
                                                        color: "white",
                                                        borderColor: "white",
                                                        "&:hover": {
                                                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                                                            borderColor: "white",
                                                        },
                                                    }}
                                                    onClick={onCopyLink}
                                                >
                                                    <Typography variant="caption" sx={{ opacity: 0.9 }}>
                                                        Sao chép liên kết
                                                    </Typography>
                                                </Button>
                                            </Tooltip>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Paper>

                        {/* Statistics section */}
                        <Grid container spacing={2}>
                            <Grid size={6}>
                                <Paper elevation={0} sx={{ p: 2, borderRadius: 2 }}>
                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                        <PeopleIcon sx={{ color: "#3498db", mr: 2, fontSize: 48 }} />
                                        <Typography variant="h5" fontWeight="medium">
                                            {getConfirmedMemberCount(course)} Thành Viên
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Grid>

                            <Grid size={6}>
                                <Paper elevation={0} sx={{ p: 2, borderRadius: 2 }}>
                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                        <ContentCopyOutlinedIcon
                                            sx={{ color: "#3498db", mr: 2, fontSize: 48 }}
                                        />
                                        <Typography variant="h5" fontWeight="medium">
                                            {Array.isArray(examGroups) ? examGroups.length : 0} Bài Kiểm Tra
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Grid>
                        </Grid>

                        <Member course={course ?? undefined} />
                    </Grid>

                    <Grid size={{ xs: 0, lg: 4 }} sx={{ flexGrow: 1, flexShrink: 0 }}>
                        <RecentActivity examGroups={examGroups} />
                    </Grid>
                </Grid>
            )}
        </Box>
    );
}
