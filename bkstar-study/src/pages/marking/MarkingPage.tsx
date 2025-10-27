import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Box,
    Typography,
    Tabs,
    Tab,
    CircularProgress,
    Alert,
    Button,
    Radio,
    FormControlLabel,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { examResultApi } from "@/api";
import type {
    ApiExamResult
} from "@/types";

export interface Answer {
    id: number;
    question: number;
    index: number;
    answer: string;
    is_correct: boolean[] | null; // với long-response = null
    type: "single-choice" | "multiple-choice" | "long-response";
}

const MarkingPage: React.FC = () => {
    const { studentId, examGroupId } = useParams<{
        studentId: string;
        examGroupId: string;
    }>();

    const [results, setResults] = useState<ApiExamResult[]>([]);
    const [tabIndex, setTabIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    // State để lưu đáp án được chấm thủ công
    const [marking, setMarking] = useState<Record<number, boolean | null>>({});

    // Gọi API lấy kết quả thi
    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            setError(null);
            try {
                if (!studentId || !examGroupId) return;
                const res = await examResultApi.getByStudentAndExamGroup(
                    Number(studentId),
                    Number(examGroupId)
                );
                setResults(res);

                // Khởi tạo state cho phần chấm tay
                const markingInit: Record<number, boolean | null> = {};
                res.forEach((exam) => {
                    exam.answers.forEach((a: any) => {
                        if (a.type === "long-response") {
                            markingInit[a.id] =
                                a.is_correct !== null
                                    ? Array.isArray(a.is_correct)
                                        ? a.is_correct[0]
                                        : a.is_correct
                                    : null;
                        }
                    });
                });
                setMarking(markingInit);
            } catch (err) {
                console.error("fetchResults error:", err);
                setError("Không thể tải dữ liệu bài làm.");
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [studentId, examGroupId]);

    const handleMarkChange = (answerId: number, value: boolean) => {
        setMarking((prev) => ({ ...prev, [answerId]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const current = results[tabIndex];
            if (!current) throw new Error("Không có bài để lưu.");

            const questionsForPayload = current.answers.map((ans) => {
                let isCorrect: boolean[] | null = null;

                if (ans.type === "long-response") {
                    const manualMark = marking[ans.id];
                    isCorrect = [manualMark === true];
                } else {
                    isCorrect = ans.is_correct == null
                        ? null
                        : Array.isArray(ans.is_correct)
                            ? ans.is_correct
                            : [ans.is_correct];
                }

                return {
                    id: ans.id,
                    question: ans.question,
                    answer: ans.answer,
                    is_correct: isCorrect
                };
            });

            const updatePayload = {
                id: current.id,
                exam: current.exam,
                user: current.user,
                status: "remarked",
                questions: questionsForPayload,
                device: current.device ?? "desktop"
            };

            console.log("PUT exam_result payload:", updatePayload);

            await examResultApi.updateExamReult(current.id, updatePayload);

            const updatedAnswers = current.answers.map((ans: any) => {
                const updated = questionsForPayload.find((q: any) => q.id === ans.id);
                return updated ? { ...ans, is_correct: updated.is_correct } : ans;
            });
            const newResults = [...results];
            newResults[tabIndex] = {
                ...current,
                answers: updatedAnswers,
            };

            setResults(newResults);

            alert("✅ Lưu thành công");
        } catch (err) {
            console.error("Save marking failed:", err);
            alert("❌ Lưu thất bại");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box p={2}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    if (results.length === 0) {
        return (
            <Box p={2}>
                <Alert severity="info">Học sinh chưa có bài làm nào.</Alert>
            </Box>
        );
    }

    const current = results[tabIndex];
    const total = current.number_of_question;
    const correct = current.answers.filter((ans: any) => {
        if (ans.type === "long-response") {
            return marking[ans.id] === true;
        }
        if (ans.is_correct === null) return false;
        return Array.isArray(ans.is_correct)
            ? ans.is_correct.every((v: boolean) => v === true)
            : ans.is_correct;
    }).length;

    const unanswered = current.answers.filter(
        (a: any) => a.answer === "" || a.answer === null
    ).length;

    return (
        <Box p={2}>
            <Typography variant="h5" gutterBottom>
                Chấm bài
            </Typography>

            <Box sx={{ bgcolor: "#fff", borderRadius: 2, padding: 4, mt: 4 }}>

                <Tabs
                    value={tabIndex}
                    onChange={(_, val) => setTabIndex(val)}
                    sx={{ mb: 2 }}
                >
                    {results.map((r, idx) => (
                        <Tab key={r.id} label={`Đề ${idx + 1}`} />
                    ))}
                </Tabs>

                {/* Tổng quan */}
                <Box
                    sx={{
                        display: "flex",
                        gap: 4,
                        flexWrap: "wrap",
                        alignItems: "center",
                        mb: 3,
                    }}
                >
                    <Box>
                        <Typography>Tên đề: Đề {tabIndex + 1}</Typography>
                        <Typography>
                            Thời gian nộp bài:{" "}
                            {new Date(current.created_at).toLocaleString("vi-VN")}
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? "Đang lưu..." : "Lưu lại"}
                    </Button>
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        border: "1px solid #e2e8f0",
                        borderRadius: 2,
                        p: 2
                    }}
                >
                    <Box>
                        <Typography>Tổng số câu: {total}</Typography>
                        <Typography>Số câu đúng: {correct}</Typography>
                        <Typography>Số câu sai: {total - correct}</Typography>
                        <Typography>Số câu chưa chấm: {unanswered}</Typography>
                    </Box>

                    <Box
                        sx={{
                            position: "relative",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {/* Vòng nền */}
                        <CircularProgress
                            variant="determinate"
                            value={100}
                            size={80}
                            thickness={5}
                            sx={{
                                color: (theme) =>
                                    theme.palette.grey[theme.palette.mode === "light" ? 300 : 800],
                                position: "absolute",
                                left: 0,
                            }}
                        />

                        {/* Vòng tiến độ */}
                        <CircularProgress
                            variant="determinate"
                            value={(correct / total) * 100}
                            size={80}
                            thickness={5}
                            color={"success"}
                        />

                        {/* Text ở giữa */}
                        <Box
                            sx={{
                                position: "absolute",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexDirection: "column",
                            }}
                        >
                            <Typography variant="body2" fontWeight="bold">
                                {`${correct}/${total}`}
                            </Typography>
                        </Box>
                    </Box>


                </Box>

                {/* Danh sách câu trả lời */}
                <Box>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                        Câu trả lời:
                    </Typography>
                    {current.answers
                        .slice()
                        .sort((a: any, b: any) => a.index - b.index)
                        .map((ans: any, idx: number) => {
                            if (ans.type === "long-response" && ans.is_correct === null) {
                                return (
                                    <Box
                                        key={ans.id}
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            mb: 0.5,
                                            gap: 1,
                                        }}
                                    >
                                        <span style={{ width: 80 }}>Câu {idx + 1}:</span>
                                        <strong>{ans.answer}</strong>
                                        <FormControlLabel
                                            control={
                                                <Radio
                                                    checked={marking[ans.id] === true}
                                                    onChange={() => handleMarkChange(ans.id, true)}
                                                />
                                            }
                                            label="Đúng"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Radio
                                                    checked={marking[ans.id] === false}
                                                    onChange={() => handleMarkChange(ans.id, false)}
                                                />
                                            }
                                            label="Sai"
                                        />
                                    </Box>
                                );
                            }

                            // Các loại trắc nghiệm
                            const correctState = Array.isArray(ans.is_correct)
                                ? ans.is_correct.every((v: any) => v === true)
                                : ans.is_correct;
                            return (
                                <Typography
                                    key={ans.id}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        mb: 0.5,
                                        color:
                                            correctState === true
                                                ? "success.main"
                                                : correctState === false
                                                    ? "error.main"
                                                    : "inherit",
                                    }}
                                >
                                    <span style={{ width: 80 }}>Câu {idx + 1}:</span>
                                    <strong>{ans.answer || "(Chưa trả lời)"}</strong>
                                    {correctState === true && (
                                        <CheckIcon color="success" sx={{ ml: 1 }} />
                                    )}
                                    {correctState === false && (
                                        <CloseIcon color="error" sx={{ ml: 1 }} />
                                    )}
                                </Typography>
                            );
                        })}
                </Box>
            </Box>
        </Box>
    );
};

export default MarkingPage;
