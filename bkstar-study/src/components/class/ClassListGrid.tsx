import React from "react";
import { Box, Typography } from "@mui/material";
import { ClassCard } from "./ClassCard";
import type { Class } from "@/types/class.types";
import { useNavigate } from "react-router-dom";
import { classApi } from "@/api";

interface ClassListGridProps {
    classes: Class[];
    searchTerm: string;
    onShare: (code: number) => void;
    onEnterClass: (classId: number) => void;
    onEdit?: (classData: Class) => void;
}

export const ClassListGrid: React.FC<ClassListGridProps> = React.memo(
    ({ classes, searchTerm, onShare, onEdit }) => {
        const navigate = useNavigate();

        if (classes.length === 0) {
            return (
                <Box sx={{ textAlign: "center", py: 8 }}>
                    <Typography variant="h6" color="text.secondary">
                        {searchTerm
                            ? "Không tìm thấy lớp học nào"
                            : "Chưa có lớp học nào"}
                    </Typography>
                </Box>
            );
        }

        const handleEnterClass = async (id: number) => {
            try {
                const course = await classApi.getClassById(id)
                if (course) {
                    navigate(`/class/${id}`, { state: course });
                }
            } catch (error) {
                console.error("Không thể lấy thông tin lớp học:", error);
            }
        };


        return (
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        md: "repeat(2, 1fr)",
                        lg: "repeat(3, 1fr)",
                    },
                    gap: 2.5,
                    rowGap: 3,
                }}
            >
                {classes.map((cls) => (
                    <ClassCard
                        key={cls.id}
                        classData={cls}
                        color='#31b5ee'
                        onShare={onShare}
                        onEnterClass={handleEnterClass}
                        onEdit={onEdit}
                    />
                ))}
            </Box>
        );
    }
);
