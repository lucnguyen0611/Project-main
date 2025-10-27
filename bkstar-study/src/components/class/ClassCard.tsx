import React from "react";
import { Box, Typography, Card, Button } from "@mui/material";
import {
    Share as ShareIcon,
    MeetingRoom as MeetingRoomIcon,
} from "@mui/icons-material";
import type { Class } from "@/types/class.types";
import { getConfirmedMemberCount } from "@/utils/class.utils";

interface ClassCardProps {
    classData: Class;
    color: string;
    onShare: (code: number) => void;
    onEnterClass: (classId: number) => void;
    onEdit?: (classData: Class) => void;
}

export const ClassCard: React.FC<ClassCardProps> = React.memo(
    ({ classData, color, onShare, onEnterClass, onEdit }) => {
        console.log('classData', classData)
        return (
            <Card
                sx={{
                    height: { xs: 160, sm: 180 },
                    background: color,
                    color: "#fff",
                    borderRadius: 3,
                    boxShadow: 3,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    p: { xs: 2, sm: 2.5 },
                    position: "relative",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 1,
                    }}
                >
                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{
                            color: "#fff",
                            fontSize: { xs: "1rem", sm: "1.1rem" },
                            lineHeight: 1.2,
                            maxWidth: "70%",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {classData.name}
                    </Typography>
                    <Button
                        variant="text"
                        size="small"
                        startIcon={<MeetingRoomIcon />}
                        sx={{
                            color: "#fff",
                            textTransform: "none",
                            fontWeight: 500,
                            p: { xs: 0.3, sm: 0.5 },
                            minWidth: "auto",
                            fontSize: { xs: "0.75rem", sm: "0.875rem" },
                            "&:hover": {
                                background: "rgba(255,255,255,0.1)",
                            },
                        }}
                        onClick={() => onEnterClass(classData.id)}
                    >
                        Vào lớp
                    </Button>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        mb: 2,
                    }}
                >
                    <Typography
                        variant="h2"
                        fontWeight="bold"
                        sx={{
                            color: "#fff",
                            mb: 0.5,
                            fontSize: { xs: "2rem", sm: "2.5rem" },
                            lineHeight: 1,
                        }}
                    >
                        {getConfirmedMemberCount(classData)}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            color: "#fff",
                            fontSize: "0.875rem",
                            opacity: 0.9,
                        }}
                    >
                        Thành viên tham gia
                    </Typography>
                </Box>

                {/* Bottom Section - Class Code, Teacher, and Share Button */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            color: "#fff",
                            fontSize: "0.875rem",
                        }}
                    >
                        Mã lớp: {classData.code}
                    </Typography>

                    <Box>
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<ShareIcon />}
                            sx={{
                                color: "#fff",
                                borderColor: "#fff",
                                borderWidth: 1,
                                textTransform: "none",
                                fontSize: { xs: "0.7rem", sm: "0.75rem" },
                                px: { xs: 1, sm: 1.5 },
                                py: { xs: 0.3, sm: 0.5 },
                                minWidth: "auto",
                                "&:hover": {
                                    borderColor: "#fff",
                                    background: "rgba(255,255,255,0.1)",
                                },
                            }}
                            onClick={() => onShare(classData.id)}
                        >
                            Chia sẻ
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            sx={{
                                color: "#fff",
                                borderColor: "#fff",
                                borderWidth: 1,
                                textTransform: "none",
                                fontSize: { xs: "0.7rem", sm: "0.75rem" },
                                px: { xs: 1, sm: 1.5 },
                                py: { xs: 0.3, sm: 0.5 },
                                ml: 1,
                                minWidth: "auto",
                                "&:hover": {
                                    borderColor: "#fff",
                                    background: "rgba(255,255,255,0.1)",
                                },
                            }}
                            onClick={() => onEdit?.(classData)}
                        >
                            Chỉnh sửa
                        </Button>
                    </Box>
                </Box>
            </Card>
        );
    }
);
