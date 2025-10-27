import React from "react";
import { Box, Typography, Card, CardContent, Button } from "@mui/material";

interface Student {
    id: number;
    name: string;
    email: string;
}

interface Props {
    students: Student[];
    onViewDetail?: (studentId: number) => void;
}

export const ResultGroup: React.FC<Props> = ({ students, onViewDetail }) => {
    if (!students.length) {
        return (
            <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
                Không có học sinh nào đã nộp bài.
            </Typography>
        );
    }

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
                            <Typography fontWeight={600}>{s.name}</Typography>
                            <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
                                {s.email}
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

