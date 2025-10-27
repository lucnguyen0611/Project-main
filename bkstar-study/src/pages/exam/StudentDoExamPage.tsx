import { useReducer, useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, Container, Typography, Grid } from "@mui/material";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
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
    file?: { id: number | null; url?: string };
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

    const isMountedRef = useRef(false);

    const getDeviceType = useCallback((): string => {
        if (isMobile) return "mobile";
        if (isTablet) return "tablet";
        if (isDesktop) return "desktop";
        return "unknown";
    }, []);

    // Fetch exam data
    useEffect(() => {
        let mounted = true;
        isMountedRef.current = true;

        const fetchExam = async () => {
            if (!examId) {
                console.error("No exam id provided");
                navigate(-1);
                return;
            }
            try {
                const examData = (await examApi.getExamById(examId)) as ExamApiShape;

                if (!mounted) return;

                const questions = (examData.questions ?? []).map((q) => ({
                    questionId: q.id,
                    questionIndex: q.index,
                    questionType: q.type,
                    answer: ""
                }));

                const payload = {
                    examName: examData.name,
                    examCode: examData.code,
                    examFile: examData.file ?? { id: null, url: undefined },
                    questions,
                    timeLeft: examData.total_time ?? 0,
                    device: getDeviceType()
                };

                dispatch({ type: "LOAD_INITIAL_DATA", payload });
                setIsDataReady(true);
            } catch (err) {
                console.error("Failed to load exam data:", err);
                showToast("Không tải được dữ liệu đề thi.", "error");
                navigate(-1);
            }
        };

        fetchExam();

        return () => {
            mounted = false;
            isMountedRef.current = false;
        };
    }, [examId, navigate, getDeviceType, showToast]);

    // Countdown
    useEffect(() => {
        if (!isDataReady || submitted) return;

        const interval = setInterval(() => {
            dispatch({ type: "COUNTDOWN" });
        }, 1000);

        return () => clearInterval(interval);
    }, [isDataReady, submitted]);

    // Auto submit when time runs out
    useEffect(() => {
        if (!isDataReady) return;
        if (state.timeLeft <= 0 && !submitted && !isSubmitting) {
            submitExam("doing");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.timeLeft, isDataReady, submitted, isSubmitting]);

    // Block unload or back when not submitted
    useEffect(() => {
        if (!isDataReady || submittedRef.current) return;

        window.history.pushState(null, "", window.location.href);

        const onBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = "";
            return "";
        };

        const onPopState = () => {
            if (submittedRef.current) return;
            const confirmLeave = window.confirm(
                "Bạn chưa nộp bài. Thoát sẽ mất dữ liệu. Tiếp tục?"
            );
            if (!confirmLeave) {
                window.history.pushState(null, "", window.location.href);
            }
        };

        window.addEventListener("beforeunload", onBeforeUnload);
        window.addEventListener("popstate", onPopState);

        return () => {
            window.removeEventListener("beforeunload", onBeforeUnload);
            window.removeEventListener("popstate", onPopState);
        };
    }, [isDataReady]);

    const submitExam = useCallback(
        async (status: "doing" | "completed") => {
            if (submittedRef.current || isSubmitting) return;
            submittedRef.current = true;
            setIsSubmitting(true);

            try {
                if (!user || !user.id) {
                    showToast?.("Người dùng chưa đăng nhập.", "error");
                    setIsSubmitting(false);
                    submittedRef.current = false;
                    return;
                }

                const payload = {
                    exam: Number(examId),
                    user: user.id,
                    device: getDeviceType(),
                    status,
                    questions: state.questions.map((q: any) => ({
                        question: q.questionId,
                        answer: q.answer ?? ""
                    }))
                };

                await examResultApi.createExamResult(payload);
                showToast?.("Nộp bài thành công", "success");

                startUnlockTimer(examId);
                setSubmitted(true);
                setIsSubmitting(false);
                navigate(-1);
            } catch (err) {
                console.error("Submit failed:", err);
                showToast?.("Nộp bài không thành công!", "error");
                setIsSubmitting(false);
                submittedRef.current = false;
            }
        },
        [examId, getDeviceType, navigate, state.questions, user, showToast, isSubmitting, startUnlockTimer]
    );

    const handleSubmitEarly = useCallback(() => {
        setIsOpenDialog(true);
    }, []);

    const handleDialogConfirm = useCallback(() => {
        setIsOpenDialog(false);
        submitExam("completed");
    }, [submitExam]);

    // ✅ Format time
    function formatTime(seconds: number) {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        const hh = hrs < 10 ? `0${hrs}` : `${hrs}`;
        const mm = mins < 10 ? `0${mins}` : `${mins}`;
        const ss = secs < 10 ? `0${secs}` : `${secs}`;
        return `${hh}:${mm}:${ss}`;
    }

    return (
        <>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#ffffff',
                p: 2
            }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Làm bài thi &gt; {state.examName}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {state.timeLeft > 0 ? (
                        <>
                            <AccessTimeIcon />
                            <Typography variant="h5" sx={{ fontWeight: 600, color: '#333333' }}>
                                {formatTime(state.timeLeft)}
                            </Typography>
                        </>
                    ) : (
                        <Typography variant="h5" color="error" sx={{ fontWeight: 600 }}>
                            Hết giờ!
                        </Typography>
                    )}
                </Box>

                <Button variant="contained" onClick={handleSubmitEarly} disabled={isSubmitting}>
                    Nộp bài sớm
                </Button>
            </Box>

            <Container maxWidth={false} sx={{
                mt: '0px', backgroundColor: '#f0f2f5',
                height: 'calc(100vh - 80px)', p: 3,
                display: 'flex',
                flexDirection: 'column'
            }}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                    flexShrink: 0
                }}>
                    <Typography variant={'h6'} fontWeight={600} color={'#333333'}>
                        Mã đề: {state.examCode}
                    </Typography>
                </Box>

                <Box sx={{ flexGrow: 1, minHeight: 0 }}>
                    <Grid container spacing={2} sx={{ height: "100%" }}>
                        <Grid size={{ xs: 12, lg: 6 }} sx={{ height: '100%' }}>
                            <Box
                                component="img"
                                src={state.examFile.url}
                                alt="Preview"
                                sx={{
                                    maxHeight: 260,
                                    maxWidth: { xs: "100%", md: 420 },
                                    borderRadius: 2,
                                    boxShadow: 1,
                                    display: "block",
                                    mt: 1,
                                }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, lg: 6 }} sx={{
                            height: '100%',
                            border: 'none',
                            overflowY: 'auto',
                            backgroundColor: "#ffffff",
                            p: 1
                        }}>
                            <StudentAnswers state={state} dispatch={dispatch} />
                        </Grid>
                    </Grid>
                </Box>
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
