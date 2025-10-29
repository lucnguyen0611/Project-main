import React, { useState } from "react";
import {
    Box,
    Typography,
    Stack,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import DeleteConfirmDialog from "@/components/dialog/DeleteConfirmDilog.tsx";
import type { ExamItem } from "@/types";

interface Props {
    exam: ExamItem;
    isTeacher?: boolean;
    onDelete?: (examId: number) => Promise<any> | void;
}

const ExamCard: React.FC<Props> = ({ exam, isTeacher, onDelete }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleCardClick = () => {
        if (!isTeacher) {
            navigate(`${location.pathname}/doing/${exam.id}`);
        }
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`${location.pathname}/${exam.id}/edit`);
    };

    const handleOpenDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        setConfirmOpen(true);
    };

    const handleCloseDelete = () => {
        setConfirmOpen(false);
    };

    // This function will be passed to DeleteConfirmDialog as onConfirm
    const handleConfirmDelete = async () => {
        if (!onDelete) {
            console.warn("onDelete not provided for ExamCard", exam.id);
            setConfirmOpen(false);
            return;
        }

        try {
            setDeleting(true);
            await onDelete(Number(exam.id));
            setConfirmOpen(false);
        } catch (err) {
            console.error("Delete failed", err);
            // optionally show toast in parent
        } finally {
            setDeleting(false);
        }
    };

    return (
        <>
            <Box
                onClick={handleCardClick}
                sx={{
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.paper",
                    height: "100%",
                    position: "relative",
                    "&:hover": {
                        boxShadow: 3,
                        cursor: isTeacher ? "default" : "pointer",
                    },
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (!isTeacher && (e.key === "Enter" || e.key === " ")) {
                        e.preventDefault();
                        handleCardClick();
                    }
                }}
            >
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle1" fontWeight={600}>
                        Đề bài: {exam.name}
                    </Typography>

                    {isTeacher && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    cursor: "pointer",
                                    "&:hover": { textDecoration: "underline" },
                                    userSelect: "none",
                                }}
                                onClick={handleEdit}
                            >
                                Sửa
                            </Typography>

                            <Typography variant="body2" color="text.secondary">
                                /
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{
                                    color: "error.main",
                                    cursor: "pointer",
                                    "&:hover": { textDecoration: "underline" },
                                    userSelect: "none",
                                }}
                                onClick={handleOpenDelete}
                            >
                                Xóa
                            </Typography>
                        </Box>
                    )}
                </Stack>

                <Typography variant="body2" sx={{ mt: 1 }}>
                    Mã đề: <strong>{exam.code ?? "-"}</strong>
                </Typography>

                <Typography variant="body2" sx={{ mt: 0.5 }}>
                    Thời gian làm bài: {Math.floor((exam.total_time ?? 0) / 60)} phút
                </Typography>

                <Typography variant="body2" sx={{ mt: 0.5 }}>
                    Số câu hỏi: {exam.number_of_question ?? 0}
                </Typography>
            </Box>

            <DeleteConfirmDialog
                open={confirmOpen}
                loading={deleting}
                title="Xác nhận xóa đề thi"
                onClose={handleCloseDelete}
                onConfirm={handleConfirmDelete}
            />
        </>
    );
};

export default ExamCard;
