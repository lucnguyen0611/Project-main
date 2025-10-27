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

interface ExamGroupHeaderProps {
    searchTerm: string;
    onSearchChange: (v: string) => void;
    isTeacher: boolean;
    onCreateClick?: () => void;
    searchLoading?: boolean;
}

export const ExamGroupHeader: React.FC<ExamGroupHeaderProps> = React.memo(
    ({searchTerm, onSearchChange ,isTeacher, onCreateClick, searchLoading = false }) => {
        return (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: {xs: "column", md: "row"},
                    alignItems: {xs: "stretch", md: "center"},
                    justifyContent: "space-between",
                    gap: 2,
                    mb: 3,
                }}
            >
                <Typography variant="h5" fontWeight="bold" sx={{mb: {xs: 1, md: 0}}}>
                    Danh sách Bài thi
                </Typography>

                <Box
                    sx={{
                        display: "flex",
                        gap: 1.5,
                        alignItems: "center",
                        width: {xs: "100%", md: "auto"},
                        flexDirection: {xs: "column", sm: "row"},
                    }}
                >
                    <TextField
                        size="small"
                        placeholder="Tìm kiếm"
                        variant="outlined"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{fontSize: 18}}/>
                                </InputAdornment>
                            ),
                            endAdornment: searchLoading ? (
                                <InputAdornment position="end">
                                    <CircularProgress size={16}/>
                                </InputAdornment>
                            ) : null,
                        }}
                        sx={{
                            width: {xs: "100%", sm: 220},
                            "& .MuiOutlinedInput-root": {
                                height: 36,
                                borderRadius: "8px",
                                fontSize: "0.9rem",
                            },
                        }}
                    />

                    {isTeacher && (
                        <Button
                            variant="contained"
                            startIcon={<AddIcon/>}
                            onClick={onCreateClick}
                            sx={{
                                height: 36,
                                textTransform: "none",
                                px: 2,
                            }}
                        >
                            Tạo bài thi
                        </Button>
                    )}
                </Box>
            </Box>
        );
    }
);
