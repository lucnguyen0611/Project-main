import React, { useState } from "react";
import { Box, Container, Typography, Card, Alert } from "@mui/material";
import { Header } from "@/components/common/Header";
import { useNavigate } from "react-router-dom";
import { classApi } from "@/api/class.api";
import { ROUTES } from "@/constants/routes";
import { CreateClassForm } from "@/components/class/CreateClassForm";
import { useAuth, useToast } from "@/contexts";

const CreateClassPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (data: { name: string; code: string }) => {
        try {
            setLoading(true);
            setError(null);

            const classData = {
                ...data,
                users: user ? [user.id] : [],
            };

            await classApi.createClass(classData);

            showToast("Tạo lớp học thành công!", "success");

            navigate(ROUTES.CLASS_LIST);
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.message || "Không thể tạo lớp học";
            setError(errorMessage);
            showToast(errorMessage, "error");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate(ROUTES.CLASS_LIST);
    };

    return (
        <Box sx={{ bgcolor: "grey.50", minHeight: "100vh" }}>
            <Header />

            <Box
                sx={{
                    mt: 8,

                }}
            >
                <Typography
                    variant="h6"
                    component="h1"
                    sx={{
                        fontWeight: 600,
                        color: "text.primary",
                        p: 2,
                    }}
                >
                    Thêm lớp học mới
                </Typography>
            </Box>

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 8,
                }}
            >
                <Container sx={{ maxWidth: 500 }}>
                    <Card
                        sx={{
                            p: 4,
                            borderRadius: 3,
                            boxShadow: 3,
                            bgcolor: "white",
                        }}
                    >
                        {/* Error Alert */}
                        {error && (
                            <Alert
                                severity="error"
                                sx={{ mb: 3 }}
                                onClose={() => setError(null)}
                            >
                                {error}
                            </Alert>
                        )}

                        {/* Form */}
                        <CreateClassForm
                            onSubmit={handleSubmit}
                            onCancel={handleCancel}
                            loading={loading}
                        />
                    </Card>
                </Container>
            </Box>
        </Box>
    );
};

export default CreateClassPage;
