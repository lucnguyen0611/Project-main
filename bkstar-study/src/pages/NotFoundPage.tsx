import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Search as SearchIcon } from "@mui/icons-material";
import { ROUTES } from "@/constants/routes";

const NotFoundPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                gap: 3,
                p: 3,
            }}
        >
            <SearchIcon sx={{ fontSize: 120, color: "text.secondary" }} />
            <Typography variant="h2" component="h1" gutterBottom>
                404
            </Typography>
            <Typography variant="h4" component="h2" gutterBottom>
                Trang không tồn tại
            </Typography>
            <Typography
                variant="body1"
                color="text.secondary"
                textAlign="center"
                sx={{ maxWidth: 500 }}
            >
                Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển đến
                địa chỉ khác.
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <Button
                    variant="contained"
                    onClick={() => navigate(ROUTES.DASHBOARD)}
                >
                    Về trang chủ
                </Button>
                <Button variant="outlined" onClick={() => navigate(-1)}>
                    Quay lại
                </Button>
            </Box>
        </Box>
    );
};

export default NotFoundPage;
