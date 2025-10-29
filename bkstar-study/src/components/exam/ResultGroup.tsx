import React from "react";
import { Box, Typography, Card, CardContent, Button } from "@mui/material";

interface Student {
    id: number;
    name: string;
    email: string;
    results: any;
}

interface Props {
    totalExam: number;
    students: Student[];
    onViewDetail?: (studentId: number) => void;
}

export const ResultGroup: React.FC<Props> = ({ totalExam, students, onViewDetail }) => {

    return (
        <Box sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Danh sách bài làm
            </Typography>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                {students.map((s) => (
                    <Card
                        key={s.id}
                        variant="outlined"
                        sx={{ width: 280, borderColor: "#26c6da" }}
                    >
                        <CardContent>
                            <Typography fontWeight={600}>Họ Tên: {s.name}</Typography>
                            <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
                                Gmail: {s.email}
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                                Số đề đã hoàn thành:
                                <span style={{ color: "#f0ad4e" }}> {s.results.length}/{totalExam}</span>
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                                Trạng thái:{" "}
                                <span style={{ color: "#f0ad4e" }}>chờ chấm lại</span>
                            </Typography>
                            <Button
                                variant="contained"
                                size="small"
                                sx={{ backgroundColor: "#00c853" }}
                                onClick={() => onViewDetail?.(s.id)}
                            >
                                Chi tiết
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </Box>
    );
};

