import React from "react";
import {
    Box,
    Typography,
    TextField,
    InputAdornment,
    Button,
    CircularProgress,
} from "@mui/material";
import { Search as SearchIcon, Add as AddIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

interface ClassListHeaderProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    isTeacher: boolean;
    searchLoading?: boolean;
}

export const ClassListHeader: React.FC<ClassListHeaderProps> = React.memo(
    ({ searchTerm, onSearchChange, isTeacher, searchLoading = false }) => {
        const navigate = useNavigate();
        return (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    alignItems: { xs: "stretch", md: "center" },
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 2,
                    mb: 3,
                }}
            >
                {/* Tiêu đề bên trái */}
                <Typography
                    variant="h6"
                    component="h1"
                    fontWeight="600"
                    color="#393b50"
                    sx={{ mb: { xs: 1, md: 0 }, flexShrink: 0 }}
                >
                    Danh sách lớp học
                </Typography>

                {/* Nhóm Tìm kiếm + Nút thêm bên phải */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        alignItems: "center",
                        justifyContent: { xs: "stretch", md: "flex-end" },
                        gap: 1.5,
                        width: { xs: "100%", md: "auto" },
                    }}
                >
                    {/* Ô tìm kiếm */}
                    <TextField
                        fullWidth
                        placeholder="Tìm kiếm"
                        variant="outlined"
                        size="small"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon/>
                                </InputAdornment>
                            ),
                            endAdornment: searchLoading ? (
                                <InputAdornment position="end">
                                    <CircularProgress size={18} />
                                </InputAdornment>
                            ) : null,
                        }}
                        sx={{
                            width: { xs: "100%", sm: 230 },
                            "& .MuiOutlinedInput-root": {
                                height: 36,
                                fontSize: "0.9rem",
                                borderRadius: "8px",
                                "& fieldset": {
                                    borderColor: "#86c9f1",
                                },
                                "&:hover fieldset": {
                                    borderColor: "#1565c0",
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "#86c9f1",
                                },
                            },
                        }}
                    />

                    {/* Nút thêm lớp học */}
                    {isTeacher && (
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => navigate(ROUTES.CLASS_ADD)}
                            sx={{
                                backgroundColor: "#ECC94B",
                                color: "#fff",
                                textTransform: "none",
                                whiteSpace: "nowrap",
                                height: 36,
                                fontSize: 14,
                                px: 2,
                                "&:hover": { backgroundColor: "#1565c0" },
                                width: { xs: "100%", sm: "auto" },
                            }}
                        >
                            Thêm lớp học
                        </Button>
                    )}
                </Box>
            </Box>

        );
    }
);
