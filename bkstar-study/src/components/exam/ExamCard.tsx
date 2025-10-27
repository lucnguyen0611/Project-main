import React from "react";
import {
    Card,
    CardContent,
    Box,
    Typography,
    IconButton,
    Tooltip,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import type { ExamItem } from "@/types";

interface Props {
    exam: ExamItem;
    isTeacher?: boolean;
}

const ExamCard: React.FC<Props> = ({ exam, isTeacher }) => {
    const navigate = useNavigate();
    const location = useLocation();
    console.log(location);

    const handleCardClick = () => {
        if (!isTeacher) {
            // doing?lesson/:examDetailId
            navigate(`${location.pathname}/doing/${exam.id}`);
        }
    };

    return (
        <Card
            variant="outlined"
            sx={{
                borderStyle: "dashed",
                borderColor: "#26c6da",
                borderWidth: 1.5,
                borderRadius: 2,
                height: "100%",
                position: "relative",
                backgroundColor: "#fff",
                "&:hover": {
                    boxShadow: 3,
                    cursor: isTeacher ? "default" : "pointer", // đổi con trỏ khi không phải teacher
                },
                p: 0,
            }}
            onClick={handleCardClick} // 👈 Thêm onClick cho cả card
        >
            {/* Edit icon top-right */}
            {isTeacher && (
                <Box sx={{ position: "absolute", top: 8, right: 8, zIndex: 2 }}>
                    <Tooltip title="Chỉnh sửa">
                        <IconButton
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation(); // 🛑 tránh click đè lên Card onClick
                                navigate(`${location.pathname}/${exam.id}/edit`);
                            }}
                            sx={{ p: 0.5 }}
                        >
                            <EditIcon fontSize="small" sx={{ color: "text.secondary" }} />
                        </IconButton>
                    </Tooltip>
                </Box>
            )}

            <CardContent sx={{ p: 2.25 }}>
                <Typography sx={{ fontWeight: 700, mb: 1 }}>
                    Đề bài: {exam.name}
                </Typography>

                <Typography variant="body2" sx={{ color: "text.secondary", mb: 0.75 }}>
                    Mã đề: {exam.code ?? "-"}
                </Typography>

                <Typography variant="body2" sx={{ color: "text.secondary", mb: 0.75 }}>
                    Thời gian làm bài: {Math.floor((exam.total_time ?? 0) / 60)} phút
                </Typography>

                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Số câu hỏi: {exam.number_of_question ?? 0}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default ExamCard;
