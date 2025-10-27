import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import type { ExamGroup } from "@/types";

interface Props {
    group: ExamGroup;
    color?: string;
    onEnterExamGroup: (examId: number) => void;
}

export const ExamGroupCard: React.FC<Props> = React.memo(
    ({group, color = "#03a9f4" , onEnterExamGroup}) => {
        const clickable = typeof onEnterExamGroup === "function";
    return (
        <Paper
            elevation={1}
            sx={{
                p: 2,
                borderLeft: `4px solid ${color}`,
                display: "flex",
                gap: 2,
                borderRadius: 2,
                height: "100%",
                flexDirection: "column",
                justifyContent: "space-between",
                cursor: clickable ? "pointer" : "default",
                '&:hover': clickable ? {
                    backgroundColor: "rgba(3,169,244,0.08)",
                } : {},
            }}
            onClick={() => clickable && onEnterExamGroup?.(group.id)}
        >
            <Box display="flex" gap={2} alignItems="flex-start">
                <AssignmentIcon sx={{ fontSize: 48, color }} />
                <Box sx={{ flex: 1 }}>
                    <Typography fontWeight="bold" noWrap>
                        {group.name}
                    </Typography>
                    <Typography fontSize={13} color="text.secondary" sx={{ mt: 0.5 }}>
                        Ngày bắt đầu: {group.start_time ? new Date(group.start_time).toLocaleDateString() : "-"}
                    </Typography>
                </Box>
            </Box>
        </Paper>
    );
});
