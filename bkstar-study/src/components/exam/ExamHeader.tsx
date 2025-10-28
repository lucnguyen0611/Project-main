import React from "react";
import { Paper, Grid, Typography, Button, Box } from "@mui/material";
import type { ExamGroup } from "@/types";

interface ExamGroupHeaderProps {
    examGroup: ExamGroup;
    onEdit: () => void;
    isTeacher: boolean;
}

export const ExamHeader: React.FC<ExamGroupHeaderProps> = ({ examGroup, onEdit, isTeacher }) => {
    return (
        <Paper
            variant="outlined"
            sx={{
                borderRadius: 2,
                p: { xs: 2, md: 3 },
                mb: 4,
                border: "1px solid",
                borderColor: "#00bcd4",
                backgroundColor: "#fafcff", // nhẹ nhàng
            }}
        >
            <Grid
                container spacing={2}
                alignItems="center"
                sx={{
                   display: "flex",
                    flexDirection: "revert",
                    justifyContent: "space-between",
                }}
            >
                <Grid>
                    <Box>
                        <Typography sx={{ fontWeight: 700, mb: 0.5, color: "text.primary" }}>
                            Tên bài thi: <Box component="span" sx={{ fontWeight: 700, ml: 0.5 }}>{examGroup.name}</Box>
                        </Typography>

                        <Typography sx={{ fontSize: 14, color: "text.secondary", mb: 0.5 }}>
                            Ngày bắt đầu: {examGroup.start_time ? new Date(examGroup.start_time).toLocaleDateString() : "-"}
                        </Typography>

                        <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
                            Thời gian chờ giữa các đề bài: {(examGroup.await_time ?? 0) / 60} phút
                        </Typography>
                    </Box>
                </Grid>

                {isTeacher && (
                    <Grid>
                        <Button
                            size={"small"}
                            variant="contained"
                            color="success"
                            onClick={onEdit}
                            sx={{ minWidth: 110, bgcolor: "#38a169" }}
                        >
                            Chỉnh sửa
                        </Button>
                    </Grid>
                )}
            </Grid>
        </Paper>
    );
};

export default ExamHeader;
