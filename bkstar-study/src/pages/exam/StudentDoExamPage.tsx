import { useReducer, useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, Container, Typography, Grid } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { isMobile, isTablet, isDesktop } from "react-device-detect";

import { initState, reducer } from "@/hooks/reducers/studentReducer";
import StudentAnswers from "@/components/student/StudentAnswers";
import StudentExamDialog from "@/components/student/StudentExamDialog";
import { examApi } from "@/api/exam.api";
import { examResultApi } from "@/api/examResult.api";
import { useAuth, useToast, useExamFlow } from "@/contexts";

type ExamApiShape = {
    id: number;
    name: string;
    code: string;
    total_time: number;
    file?: { id: number | null; url?: string; file_type?: string };
    questions: { id: number; index: number; type: string }[];
};

export default function StudentExamDetail() {
    const [state, dispatch] = useReducer(reducer, initState);
    const [isDataReady, setIsDataReady] = useState(false);
    const [isOpenDialog, setIsOpenDialog] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const navigate = useNavigate();
    const { examDetailId } = useParams<{ examDetailId: string }>();
    const examId = Number(examDetailId);

    const { user } = useAuth();
    const { showToast } = useToast();
    const { startUnlockTimer } = useExamFlow();

    const submittedRef = useRef(submitted);
    submittedRef.current = submitted;

    const getDeviceType = useCallback((): string => {
        if (isMobile) return "mobile";
        if (isTablet) return "tablet";
        if (isDesktop) return "desktop";
        return "unknown";
    }, []);

    // ✅ Fetch exam data
    useEffect(() => {
        let mounted = true;

        const fetchExam = async () => {
            try {
                const examData = (await examApi.getExamById(examId)) as ExamApiShape;
                if (!mounted) return;

                const questions = (examData.questions ?? []).map((q) => ({
                    questionId: q.id,
                    questionIndex: q.index,
                    questionType: q.type,
                    answer: "",
                }));

                const payload = {
                    examName: examData.name,
                    examCode: examData.code,
                    file: examData.file ?? { id: null, url: undefined, file_type: undefined },
                    questions,
                    timeLeft: examData.total_time ?? 0,
                    device: getDeviceType(),
                };

                dispatch({ type: "LOAD_INITIAL_DATA", payload });
                setIsDataReady(true);
            } catch (err) {
                console.error("Failed to load exam data:", err);
                showToast("Không tải được dữ liệu đề thi.", "error");
                navigate(-1);
            }
        };

        if (examId) fetchExam();
        else navigate(-1);

        return () => {
            mounted = false;
        };
    }, [examId, navigate, getDeviceType, showToast]);

    // ✅ Countdown timer
    useEffect(() => {
        if (!isDataReady || submitted) return;
        const interval = setInterval(() => dispatch({ type: "COUNTDOWN" }), 1000);
        return () => clearInterval(interval);
    }, [isDataReady, submitted]);

    // ✅ Auto submit when time runs out
    useEffect(() => {
        if (isDataReady && state.timeLeft <= 0 && !submitted && !isSubmitting) {
            submitExam("doing");
        }
    }, [state.timeLeft, isDataReady, submitted, isSubmitting]);




    // ✅ Submit exam (POST or PUT)
    const submitExam = useCallback(
        async (status: "doing" | "completed") => {
            if (submittedRef.current || isSubmitting) return;
            submittedRef.current = true;
            setIsSubmitting(true);

            try {
                if (!user?.id) {
                    showToast?.("Người dùng chưa đăng nhập.", "error");
                    setIsSubmitting(false);
                    submittedRef.current = false;
                    return;
                }

                const payload = {
                    exam_id: Number(examId),
                    user_id: user.id,
                    device: getDeviceType(),
                    status,
                    questions: state.questions.map((q) => ({
                        question_id: q.questionId,
                        answer: q.answer ?? "",
                    })),
                };

                await examResultApi.createExamResult(payload);
                showToast?.("Nộp bài thành công!", "success");

                startUnlockTimer(examId);
                setSubmitted(true);
            } catch (err) {
                console.error("Submit failed:", err);
                showToast?.("Nộp bài không thành công!", "error");
                setIsSubmitting(false);
                submittedRef.current = false;
            }
        },
        [examId, getDeviceType, navigate, state.questions, user, showToast, isSubmitting, startUnlockTimer]
    );


    // ✅ Khi nhấn nút Back => tự động nộp bài
    useEffect(() => {
        if (!isDataReady || submittedRef.current) return;

        // Ngăn trình duyệt quay lại bằng cách push thêm 1 state ảo
        window.history.pushState(null, "", window.location.href);

        // Cảnh báo khi reload hoặc đóng tab
        const onBeforeUnload = (e: BeforeUnloadEvent) => {
            if (!submittedRef.current) {
                e.preventDefault();
                e.returnValue = "";
            }
        };

        // Khi người dùng bấm nút Back
        const onPopState = async () => {
            if (submittedRef.current) return;

            // Tự động nộp bài luôn
            try {
                await submitExam("completed");
            } catch (err) {
                console.error("Lỗi khi nộp bài khi back:", err);
            } finally {
                // Sau khi nộp bài thì cho phép thoát
                window.removeEventListener("beforeunload", onBeforeUnload);
                navigate(-2); // hoặc history.back()
            }
        };

        window.addEventListener("beforeunload", onBeforeUnload);
        window.addEventListener("popstate", onPopState);

        return () => {
            window.removeEventListener("beforeunload", onBeforeUnload);
            window.removeEventListener("popstate", onPopState);
        };
    }, [isDataReady, navigate, submitExam]);

    const handleSubmitEarly = () => setIsOpenDialog(true);
    const handleDialogConfirm = () => {
        setIsOpenDialog(false);
        submitExam("completed");
    };

    const formatTime = (seconds: number) => {
        const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
        const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
        const s = String(seconds % 60).padStart(2, "0");
        return `${h}:${m}:${s}`;
    };

    return (
        <>
            {/* Header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fff", p: 2 }}>
                <Typography variant="h6" fontWeight={600}>
                    Làm bài thi &gt; {state.examName}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <AccessTimeIcon />
                    <Typography variant="h5" fontWeight={600}>
                        {state.timeLeft > 0 ? formatTime(state.timeLeft) : "Hết giờ!"}
                    </Typography>
                </Box>

                <Button variant="contained" onClick={handleSubmitEarly} disabled={isSubmitting}>
                    Nộp bài sớm
                </Button>
            </Box>

            {/* Main */}
            <Container maxWidth={false} sx={{ mt: 0, backgroundColor: "#f0f2f5", height: "calc(100vh - 80px)", p: 3 }}>
                <Box mb={3}>
                    <Typography variant="h6" fontWeight={600}>
                        Mã đề: {state.examCode}
                    </Typography>
                </Box>

                <Grid container spacing={2} sx={{ height: "100%" }}>
                    <Grid size={{ xs: 12, lg: 6 }}>
                        <embed
                            src={state.file.url}
                            type="application/pdf"
                            style={{
                                width: "100%",
                                height: "420px",
                                borderRadius: "8px",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, lg: 6 }} sx={{ overflowY: "auto", backgroundColor: "#fff", p: 2 }}>
                        <StudentAnswers state={state} dispatch={dispatch} />
                    </Grid>
                </Grid>
            </Container>

            <StudentExamDialog
                timeLeft={state.timeLeft}
                isOpenDialog={isOpenDialog}
                setIsOpenDialog={setIsOpenDialog}
                onSubmit={handleDialogConfirm}
                handleBackToExamGroupDetail={() => navigate(-1)}
            />
        </>
    );
}
