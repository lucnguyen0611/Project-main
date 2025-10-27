import React from "react";
import { Grid, Typography, Button } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import type { ExamItem } from "@/types";
import ExamCard from "./ExamCard";

interface ExamGridProps {
    exams: ExamItem[];
    classId?: string | number;
    groupId?: number;
    onReload?: () => void;
    isTeacher?: boolean;
}

export const ExamGrid: React.FC<ExamGridProps> = ({ exams, isTeacher }) => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <>
            <Grid container justifyContent="space-between" alignItems="center" mb={2}>
                <Grid>
                    <Typography variant="h6" fontWeight="700" color="primary.main">
                        Danh sách đề bài
                    </Typography>
                </Grid>
                {isTeacher && (
                    <Grid>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ textTransform: "none" }}
                            onClick={() => navigate(`${location.pathname}/create`)}
                        >
                            + Thêm đề bài
                        </Button>
                    </Grid>
                )}
            </Grid>

            <Grid container spacing={3}>
                {exams.length === 0 ? (
                    <Grid size={{ xs: 12 }}>
                        <Typography>Chưa có đề bài nào trong nhóm này.</Typography>
                    </Grid>
                ) : (
                    exams.map((e) => (
                        <Grid key={e.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                            <ExamCard
                                exam={e}
                                isTeacher={isTeacher}
                            />
                        </Grid>
                    ))
                )}
            </Grid>
        </>
    );
};

export default ExamGrid;
