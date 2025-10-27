import React from "react";
import { Box, Typography } from "@mui/material";
import { ExamGroupCard } from "./ExamGroupCard";
import type { ExamGroup } from "@/types";
import { useNavigate } from "react-router-dom";
import {examGroupApi} from "@/api";

interface Props {
    groups: ExamGroup[];
    searchTerm?: string;
}

export const ExamGroupGrid: React.FC<Props> = React.memo(
    ({groups, searchTerm = ""}) => {
        const navigate = useNavigate();

        if (!groups || groups.length === 0) {
            return (
                <Box sx={{textAlign: "center", py: 8}}>
                    <Typography variant="h6" color="text.secondary">
                        {searchTerm ? "Không tìm thấy nhóm bài thi" : "Chưa có nhóm bài thi"}
                    </Typography>
                </Box>
            );
        }

        const handleEnterExamGroup = async (id: number) => {
            try {
                const examDetail = await examGroupApi.getExamGroup(id)
                if (examDetail) {
                    navigate(`${id}`, { state: examDetail });
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
                        sm: "repeat(2, 1fr)",
                        md: "repeat(2, 1fr)",
                        lg: "repeat(3, 1fr)",
                    },
                    gap: 2.5,
                    rowGap: 3,
                }}
            >
                {groups.map((g) => (
                    <ExamGroupCard
                        key={g.id}
                        group={g}
                        color="#31b5ee"
                        onEnterExamGroup={handleEnterExamGroup}
                    />
                ))}
            </Box>
        );
    }
);
