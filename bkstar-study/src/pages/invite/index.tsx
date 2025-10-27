import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, Container, Paper, TextField, Typography } from "@mui/material";

import { useAuth, useToast } from "@/contexts";
import { classApi } from "@/api/class.api";
import type { UserClassI } from "@/types";

interface Member {
    id: number;
    name: string;
    role: string;
    email?: string;
}

function AlreadyInClassPage({
                                navigate,
                                classId,
                            }: {
    navigate: ReturnType<typeof useNavigate>;
    classId: number | null;
}) {
    return (
        <Box
            sx={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100vh",
                backgroundColor: "white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Box sx={{ textAlign: "center" }}>
                <Typography component="h1" variant="h6">
                    Bạn đã tham gia lớp học này rồi
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2, p: 2 }}
                    onClick={() => navigate(`/class/${classId}`)}
                >
                    Đi tới lớp học
                </Button>
            </Box>
        </Box>
    );
}

export default function Invite() {
    const { showToast } = useToast();
    const navigate = useNavigate();
    const { classId: classIdParam } = useParams<{ classId: string }>();
    const classId = Number(classIdParam);

    const { user, isAuthenticated, isLoading } = useAuth();

    const [isInClass, setIsInClass] = useState(false);
    const [inputCode, setInputCode] = useState("");

    const [classData, setClassData] = useState<{
        id: number;
        name: string;
        code: string;
        users: UserClassI[];
    }>({
        id: 0,
        name: "",
        code: "",
        users: [],
    });

    const fetchClassDetail = async (cid: number, uid: number, isNewJoin = false) => {
        try {
            const data = await classApi.getClassById(cid);
            const currentUserIds = (data.users ?? []).map((u: Member) => u.id);

            if (isNewJoin && !currentUserIds.includes(uid)) {
                const updatedUserIds = [...currentUserIds, uid];
                await classApi.updateClass(cid, {
                    ...data,
                    users: updatedUserIds,
                });
                showToast("Đã thêm bạn vào lớp học!", "success");
            }

            setClassData({
                id: data.id,
                name: data.name,
                code: data.code,
                users: data.users ?? [],
            });

            const alreadyIn = (data.users ?? []).some((u: Member) => u.id === uid);
            setIsInClass(alreadyIn);
        } catch (err) {
            console.error("❌ Lỗi khi lấy thông tin lớp:", err);
            showToast("Không thể tải thông tin lớp học", "error");
        }
    };

    useEffect(() => {
        if (!isLoading && isAuthenticated && user && classId) {
            void fetchClassDetail(classId, Number(user.id));
        }
    }, [isAuthenticated, isLoading, classId, user]);

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!classId) return showToast("Thiếu ID lớp học!", "error");
        if (!user?.id) return showToast("Không xác định được người dùng!", "error");
        if (!inputCode.trim()) return showToast("Vui lòng nhập mã bảo vệ!", "error");

        try {
            const payload = {
                class_id: classId,
                user_id: Number(user.id),
                code: inputCode.trim(),
            };

            await classApi.invite(payload);
            showToast("Tham gia lớp học thành công!", "success");
            await fetchClassDetail(classId, Number(user.id), true);
            navigate(`/class/${classId}`);
        } catch (error) {
            console.error("❌ Lỗi khi tham gia lớp:", error);
            showToast("Tham gia lớp thất bại, vui lòng thử lại!", "error");
        }
    };

    if (isLoading) return null;

    if (!isAuthenticated) {
        navigate("/login");
        return null;
    }

    if (isInClass) return <AlreadyInClassPage navigate={navigate} classId={classId} />;

    const teacherCount = classData.users.filter((u) => u.role === "teacher").length;
    const studentCount = classData.users.filter((u) => u.role === "student").length;

    return (
        <Container
            maxWidth={false}
            sx={{
                backgroundColor: "#f0f2f5",
                minHeight: "100vh",
                p: 3,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Paper
                sx={{
                    width: "100%",
                    maxWidth: "500px",
                    borderRadius: "10px",
                    overflow: "hidden",
                    boxShadow: "0 0 10px #000000",
                }}
            >
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 3 }}>
                    <Typography
                        component="h1"
                        variant="h4"
                        sx={{
                            fontWeight: "bold",
                            mb: 1,
                            color: "text.primary",
                            textAlign: "center",
                        }}
                    >
                        Tham gia lớp học
                    </Typography>

                    <Box component="form" sx={{ width: "100%" }} onSubmit={onSubmit}>
                        <Typography component="p" variant="h6">
                            Lớp học: {classData.name || "Đang tải..."}
                        </Typography>
                        <Typography component="p" variant="h6">
                            {teacherCount + studentCount} Thành viên
                        </Typography>

                        <TextField
                            fullWidth
                            size="small"
                            sx={{ my: 1 }}
                            placeholder="Vui lòng nhập mã bảo vệ"
                            name="inputCode"
                            value={inputCode}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setInputCode(e.target.value)
                            }
                        />

                        <Button
                            size="large"
                            variant="contained"
                            fullWidth
                            color="primary"
                            sx={{ fontWeight: "600", borderRadius: 2, mt: 2 }}
                            type="submit"
                        >
                            Tham gia lớp học
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}
