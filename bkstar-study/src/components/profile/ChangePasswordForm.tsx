import React, { useState } from "react";
import { Box, Typography, TextField, Button, Alert } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment } from "@mui/material";
import { validatePasswordData } from "@/utils/profile.utils";

interface ChangePasswordFormProps {
    userId: number;
    onSubmit: (data: {
        id: number;
        old_password: string;
        new_password: string;
    }) => Promise<void>;
    loading: boolean;
}

export const ChangePasswordForm: React.FC<ChangePasswordFormProps> = React.memo(
    ({ userId, onSubmit, loading }) => {
        const [formData, setFormData] = useState({
            current_password: "",
            new_password: "",
            confirm_password: "",
        });

        const [errors, setErrors] = useState<Record<string, string>>({});
        const [submitError, setSubmitError] = useState<string | null>(null);
        const [showPasswords, setShowPasswords] = useState({
            current: false,
            new: false,
            confirm: false,
        });

        const handleInputChange = (field: string, value: string) => {
            setFormData((prev) => ({ ...prev, [field]: value }));

            // Clear error when user starts typing
            if (errors[field]) {
                setErrors((prev) => ({ ...prev, [field]: "" }));
            }
        };

        const togglePasswordVisibility = (
            field: "current" | "new" | "confirm"
        ) => {
            setShowPasswords((prev) => ({
                ...prev,
                [field]: !prev[field],
            }));
        };

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            setSubmitError(null);

            // Validate form data
            const validationErrors = validatePasswordData(formData);

            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                return;
            }

            try {
                await onSubmit({
                    id: userId,
                    old_password: formData.current_password,
                    new_password: formData.new_password,
                });

                // Clear form and errors on success
                setFormData({
                    current_password: "",
                    new_password: "",
                    confirm_password: "",
                });
                setErrors({});
            } catch (error: any) {
                setSubmitError(
                    error.message || "Có lỗi xảy ra khi đổi mật khẩu"
                );
            }
        };

        return (
            <Box component="form" onSubmit={handleSubmit}>
                {submitError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {submitError}
                    </Alert>
                )}

                <TextField
                    fullWidth
                    type={showPasswords.current ? "text" : "password"}
                    label="Mật khẩu hiện tại"
                    value={formData.current_password}
                    onChange={(e) =>
                        handleInputChange("current_password", e.target.value)
                    }
                    error={!!errors.current_password}
                    helperText={errors.current_password}
                    required
                    sx={{ mb: 2 }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() =>
                                        togglePasswordVisibility("current")
                                    }
                                    edge="end"
                                >
                                    {showPasswords.current ? (
                                        <VisibilityOff />
                                    ) : (
                                        <Visibility />
                                    )}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                <TextField
                    fullWidth
                    type={showPasswords.new ? "text" : "password"}
                    label="Mật khẩu mới"
                    value={formData.new_password}
                    onChange={(e) =>
                        handleInputChange("new_password", e.target.value)
                    }
                    error={!!errors.new_password}
                    helperText={
                        errors.new_password ||
                        "Mật khẩu phải có ít nhất 6 ký tự"
                    }
                    required
                    sx={{ mb: 2 }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() =>
                                        togglePasswordVisibility("new")
                                    }
                                    edge="end"
                                >
                                    {showPasswords.new ? (
                                        <VisibilityOff />
                                    ) : (
                                        <Visibility />
                                    )}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                <TextField
                    fullWidth
                    type={showPasswords.confirm ? "text" : "password"}
                    label="Nhập lại mật khẩu mới"
                    value={formData.confirm_password}
                    onChange={(e) =>
                        handleInputChange("confirm_password", e.target.value)
                    }
                    error={!!errors.confirm_password}
                    helperText={errors.confirm_password}
                    required
                    sx={{ mb: 3 }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() =>
                                        togglePasswordVisibility("confirm")
                                    }
                                    edge="end"
                                >
                                    {showPasswords.confirm ? (
                                        <VisibilityOff />
                                    ) : (
                                        <Visibility />
                                    )}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        sx={{ minWidth: 120 }}
                    >
                        {loading ? "Đang đổi..." : "ĐỔI MẬT KHẨU"}
                    </Button>
                </Box>
            </Box>
        );
    }
);
