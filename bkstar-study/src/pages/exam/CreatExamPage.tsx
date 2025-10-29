import {
    Grid,
    Typography,
    Button,
    Paper,
    Box,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiClient } from "@/api/axios.ts";
import { examApi } from "@/api/exam.api";
import type { ExamItem } from "@/types";
import QuestionTeacher from "@/components/question/QuestionTeacher.tsx";
import AutoSizer from "react-virtualized-auto-sizer";
import { Virtuoso } from "react-virtuoso";
import { validateRequired } from "@/utils";
import ExamInfoForm from "@/components/textField/ExamInfoForm.tsx";
import { useToast } from "@/contexts";

interface Props {
    mode: "create" | "edit";
}

export default function CreateExamPage({ mode }: Props) {
    const { examGroupId, examDetailId } = useParams();
    const navigate = useNavigate();

    const groupId = Number(examGroupId);
    const examId = Number(examDetailId);

    const { showToast } = useToast();

    // ✅ Form state tổng
    const [formTextField, setFormTextField] = useState({
        name: "",
        code: "",
        totalTime: 0,
        description: "",
        questionCount: 1,
    });

    const handleFormChange = (field: string, value: any) => {
        setFormTextField((prev) => ({ ...prev, [field]: value }));
    };

    // ✅ Validate
    const [validationErrors, setValidationErrors] = useState<{
        name?: string;
        code?: string;
        totalTime?: string;
        description?: string;
    }>({});

    const validateForm = (): boolean => {
        const errors: typeof validationErrors = {};

        const nameValidation = validateRequired(formTextField.name, "Tên bài thi");
        if (!nameValidation.isValid) errors.name = nameValidation.errors[0];

        const codeValidation = validateRequired(formTextField.code, "Mã bài thi");
        if (!codeValidation.isValid) errors.code = codeValidation.errors[0];

        const descriptionValidation = validateRequired(formTextField.description, "Mô tả");
        if (!descriptionValidation.isValid)
            errors.description = descriptionValidation.errors[0];

        if (formTextField.totalTime === 0 || Number(formTextField.totalTime) <= 0)
            errors.totalTime = "Thời gian phải lớn hơn 0";

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // ✅ Các state khác
    const [questionTypes, setQuestionTypes] = useState<{ [key: number]: string }>({});
    const [singleAnswers, setSingleAnswers] = useState<{ [key: number]: string }>({});
    const [multiAnswers, setMultiAnswers] = useState<{ [key: number]: string[] }>({});
    const [fillAnswers, setFillAnswers] = useState<{ [key: number]: string }>({});
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [fileId, setFileId] = useState<number | null>(null);
    const [fileType, setFileType] = useState<string | null>(null);
    const [originalQuestions, setOriginalQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // ✅ Lấy dữ liệu đề thi khi sửa
    useEffect(() => {
        if (mode !== "edit" || !examId) return;
        const fetchExamDetail = async () => {
            try {
                const data: ExamItem = await examApi.getExamById(examId);
                setFormTextField({
                    name: data.name,
                    code: data.code,
                    totalTime: Math.round((data.total_time ?? 0) / 60),
                    description: data.description ?? "",
                    questionCount: data.number_of_question ?? 1,
                });
                setFileUrl(data.file?.url ?? null);
                setFileId(data.file?.id ?? null);
                setFileType(data.file?.file_type ?? null);
                setOriginalQuestions(data.questions ?? []);

                const qt: any = {};
                const s: any = {};
                const m: any = {};
                const f: any = {};
                (data.questions ?? []).forEach((q, i) => {
                    const idx = i + 1;
                    if (q.type === "single-choice") qt[idx] = "single";
                    else if (q.type === "multiple-choice") qt[idx] = "multi";
                    else qt[idx] = "fill";
                    if (qt[idx] === "single") s[idx] = q.correct_answer;
                    if (qt[idx] === "multi") m[idx] = q.correct_answer?.split(",") || [];
                    if (qt[idx] === "fill") f[idx] = q.correct_answer;
                });
                setQuestionTypes(qt);
                setSingleAnswers(s);
                setMultiAnswers(m);
                setFillAnswers(f);
            } catch (err) {
                console.error(err);
            }
        };
        fetchExamDetail();
    }, [mode, examId]);

    // ✅ Upload file
    const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0] ?? null;
        if (!f) return;
        setSelectedFile(f);
        const isPreviewable = f.type.startsWith("image/") || f.type === "application/pdf";
        if (isPreviewable) {
            const preview = URL.createObjectURL(f);
            if (fileUrl && fileUrl.startsWith("blob:")) URL.revokeObjectURL(fileUrl);
            setFileUrl(preview);
        } else setFileUrl(null);
        setFileType(f.type.split("/")[1] ?? "unknown");
    };

    useEffect(() => {
        return () => {
            if (fileUrl && fileUrl.startsWith("blob:")) URL.revokeObjectURL(fileUrl);
        };
    }, [fileUrl]);

    // ✅ Đồng bộ state khi thay đổi số câu hỏi
    useEffect(() => {
        const count = formTextField.questionCount;
        const syncState = <T,>(prev: Record<number, T>, init: () => T): Record<number, T> => {
            const updated = { ...prev };
            for (let i = 1; i <= count; i++) if (!updated[i]) updated[i] = init();
            Object.keys(updated).forEach((k) => {
                if (Number(k) > count) delete updated[Number(k)];
            });
            return updated;
        };
        setQuestionTypes((p) => syncState(p, () => "single"));
        setSingleAnswers((p) => syncState(p, () => ""));
        setMultiAnswers((p) => syncState(p, () => []));
        setFillAnswers((p) => syncState(p, () => ""));
    }, [formTextField.questionCount]);

    // ✅ Tạo danh sách câu hỏi
    const buildQuestions = () =>
        Array.from({ length: formTextField.questionCount }, (_, i) => {
            const idx = i + 1;
            const uiType = questionTypes[idx] || "single";
            const type =
                uiType === "single"
                    ? "single-choice"
                    : uiType === "multi"
                        ? "multiple-choice"
                        : "long-response";
            let correct_answer = "";
            if (uiType === "single") correct_answer = singleAnswers[idx] ?? "";
            else if (uiType === "multi")
                correct_answer = (multiAnswers[idx] ?? []).join(",");
            else correct_answer = fillAnswers[idx] ?? "";
            const existing = originalQuestions?.[i];
            if (existing && typeof existing.id !== "undefined") {
                return { id: existing.id, index: i, type, correct_answer };
            }
            return { index: i, type, correct_answer };
        });

    // ✅ Submit
    const handleSubmit = async () => {
        if (!validateForm()) return;

        const questions = buildQuestions();
        setLoading(true);
        try {
            const url = mode === "edit" && examId ? `/exams/${examId}` : "/exams";
            const form = new FormData();
            if (selectedFile) form.append("examFile", selectedFile);
            else if (mode === "edit" && fileId) form.append("file_id", String(fileId));
            form.append("name", formTextField.name);
            form.append("code", String(formTextField.code ?? ""));
            form.append("exam_group_id", String(groupId));
            form.append("number_of_question", String(formTextField.questionCount));
            form.append("total_time", String(Number(formTextField.totalTime) * 60));
            form.append("description", formTextField.description ?? "");
            form.append("questions", JSON.stringify(questions));
            form.append("correct_answer", JSON.stringify({}));

            if (mode === "edit" && examId)
                await apiClient.put(url, form, { headers: { "Content-Type": "multipart/form-data" } });
            else
                await apiClient.post(url, form, { headers: { "Content-Type": "multipart/form-data" } });

            if (mode === "edit") {
                showToast("Cập nhật đề thi thành công!", "success");
            } else {
                showToast("Tạo đề thi thành công!", "success");
            }
            navigate(-1);
        } catch (err: any) {
            console.error("Gửi lỗi:", err);
            const message = err?.response?.data?.message || err?.message || "Lỗi khi gửi dữ liệu";
            showToast(message, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box p={2}>
            {/* Khu Upload File */}
            <Paper
                sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 2,
                    border: "1px dashed rgba(38,198,218,0.6)",
                    textAlign: "center",
                    bgcolor: "#fafcff",
                }}
            >
                <input type="file" hidden id="upload-file" onChange={handleSelectFile} />
                {!fileUrl && !fileId ? (
                    <label htmlFor="upload-file">
                        <Button variant="outlined" component="span">
                            📤 Tải lên file (PDF, ảnh, docx...)
                        </Button>
                    </label>
                ) : (
                    <Box>
                        {fileUrl ? (
                            fileType === "pdf" ? (
                                <embed src={fileUrl} type="application/pdf" width="100%" height="420" />
                            ) : (
                                <img src={fileUrl} alt="preview" style={{ maxWidth: 400, borderRadius: 8 }} />
                            )
                        ) : (
                            <Typography>{selectedFile?.name || "Giữ file cũ"}</Typography>
                        )}
                        <Button
                            variant="text"
                            color="error"
                            onClick={() => {
                                if (fileUrl && fileUrl.startsWith("blob:")) URL.revokeObjectURL(fileUrl);
                                setSelectedFile(null);
                                setFileUrl(null);
                                setFileId(null);
                                setFileType(null);
                            }}
                        >
                            Xóa file
                        </Button>
                    </Box>
                )}
            </Paper>

            {/* Thông tin đề thi */}
            <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Grid container spacing={2}>
                    <ExamInfoForm
                        {...formTextField}
                        validationErrors={validationErrors}
                        onChange={handleFormChange}
                    />

                    {/* Danh sách câu hỏi */}
                    <Grid size={{ xs: 12}}>
                        <Box mt={2} sx={{ height: "50vh" }}>
                            <AutoSizer>
                                {({ height, width }) => (
                                    <div style={{ height, width }}>
                                        <Virtuoso
                                            style={{ height: "100%" }}
                                            totalCount={formTextField.questionCount}
                                            itemContent={(index) => (
                                                <div
                                                    style={{
                                                        height: 50,
                                                        boxSizing: "border-box",
                                                        padding: 8,
                                                    }}
                                                >
                                                    <QuestionTeacher
                                                        index={index}
                                                        type={questionTypes[index + 1] || "single"}
                                                        onChangeType={(t) =>
                                                            setQuestionTypes((prev) => ({ ...prev, [index + 1]: t }))
                                                        }
                                                        singleAnswer={singleAnswers[index + 1] || ""}
                                                        onChangeSingle={(v) =>
                                                            setSingleAnswers((prev) => ({ ...prev, [index + 1]: v }))
                                                        }
                                                        multiAnswers={multiAnswers[index + 1] || []}
                                                        onChangeMulti={(arr) =>
                                                            setMultiAnswers((prev) => ({ ...prev, [index + 1]: arr }))
                                                        }
                                                    />
                                                </div>
                                            )}
                                        />
                                    </div>
                                )}
                            </AutoSizer>
                        </Box>
                    </Grid>

                    {/* Nút lưu */}
                    <Grid size={{ xs: 12 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={handleSubmit}
                            disabled={loading}
                            sx={{ mt: 2 }}
                        >
                            {mode === "edit" ? "Cập nhật đề thi" : "Tạo đề thi"}
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
}
