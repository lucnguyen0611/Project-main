import React, { useState, useEffect } from "react";
import {
    Box,
    TextField,
    Button,
    Alert,
    CircularProgress,
    Link as MuiLink,
    FormControlLabel,
    Checkbox,
    InputAdornment,
    IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "@/contexts";
import { validateEmail, validateRequired } from "@/utils/validation.utils";
// import { useNavigate } from "react-router-dom";

interface LoginFormProps {
    onSwitchToRegister?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
    const { login, isLoading, error, clearError, getRememberEmail } = useAuth();
    // const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        remember: false,
    });

    // Load remember email on component mount
    useEffect(() => {
        const rememberEmail = getRememberEmail();
        if (rememberEmail) {
            setFormData((prev) => ({
                ...prev,
                email: rememberEmail,
                remember: true,
            }));
        }
    }, [getRememberEmail]);
    const [showPassword, setShowPassword] = useState(false);
    const [validationErrors, setValidationErrors] = useState<{
        email?: string;
        password?: string;
    }>({});

    const validateForm = (): boolean => {
        const errors: { email?: string; password?: string } = {};

        // Validate email
        const emailValidation = validateRequired(formData.email, "Email");
        if (!emailValidation.isValid) {
            errors.email = emailValidation.errors[0];
        } else if (!validateEmail(formData.email)) {
            errors.email = "Email không hợp lệ";
        }

        // Validate password
        const passwordValidation = validateRequired(
            formData.password,
            "Mật khẩu"
        );
        if (!passwordValidation.isValid) {
            errors.password = passwordValidation.errors[0];
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }));

        // Clear validation error when user starts typing
        if (
            typeof value === "string" &&
            validationErrors[field as keyof typeof validationErrors]
        ) {
            setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
        }

        // Clear auth error when user starts typing
        if (error) {
            clearError();
        }
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event.preventDefault();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await login(formData.email, formData.password, formData.remember);
        } catch (error) {
            // Error is handled by AuthContext
        }
    };

    return (
        <Box
            component="form"
            sx={{ width: "100%" }}
            noValidate
            onSubmit={handleSubmit}
        >
            {/* Optional: Error alert */}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
                    {error}
                </Alert>
            )}

            <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Nhập email *"
                name="email"
                autoComplete="email"
                autoFocus
                variant="outlined"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                error={!!validationErrors.email}
                helperText={validationErrors.email}
                disabled={isLoading}
                inputProps={{
                    maxLength: 100,
                    pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
                }}
                sx={{
                    "& .MuiOutlinedInput-root": {
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        backdropFilter: "blur(10px)",
                        "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 1)",
                        },
                        "&.Mui-focused": {
                            backgroundColor: "rgba(255, 255, 255, 1)",
                        },
                    },
                    "& .MuiInputLabel-root": {
                        color: "rgba(0, 0, 0, 0.7)",
                    },
                }}
            />

            <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Nhập mật khẩu *"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                error={!!validationErrors.password}
                helperText={validationErrors.password}
                disabled={isLoading}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                            >
                                {showPassword ? (
                                    <VisibilityOff />
                                ) : (
                                    <Visibility />
                                )}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                sx={{
                    "& .MuiOutlinedInput-root": {
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        backdropFilter: "blur(10px)",
                        "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 1)",
                        },
                        "&.Mui-focused": {
                            backgroundColor: "rgba(255, 255, 255, 1)",
                        },
                    },
                    "& .MuiInputLabel-root": {
                        color: "rgba(0, 0, 0, 0.7)",
                    },
                }}
            />

            <FormControlLabel
                control={
                    <Checkbox
                        value="remember"
                        color="primary"
                        checked={formData.remember}
                        onChange={(e) =>
                            handleInputChange("remember", e.target.checked)
                        }
                        disabled={isLoading}
                        sx={{
                            "& .MuiSvgIcon-root": {
                                color: "#666",
                            },
                            "&.Mui-checked .MuiSvgIcon-root": {
                                color: "#1976d2",
                            },
                        }}
                    />
                }
                label="Ghi nhớ đăng nhập"
                sx={{
                    color: "#333",
                    "& .MuiFormControlLabel-label": {
                        color: "#333",
                    },
                }}
            />

            <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
                sx={{
                    mt: 2,
                    mb: 2,
                    py: 1.5,
                    backgroundColor: "rgba(25, 118, 210, 0.9)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    "&:hover": {
                        backgroundColor: "rgba(25, 118, 210, 1)",
                        transform: "translateY(-1px)",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    },
                    transition: "all 0.3s ease",
                }}
            >
                {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                ) : (
                    "ĐĂNG NHẬP"
                )}
            </Button>

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "center", sm: "flex-start" },
                    gap: { xs: 1, sm: 0 },
                }}
            >
                <MuiLink
                    component="button"
                    type="button"
                    variant="body2"
                    onClick={onSwitchToRegister}
                    sx={{
                        textDecoration: "none",
                        color: "#1976d2",
                        cursor: "pointer",
                        "&:hover": {
                            color: "#1565c0",
                            textDecoration: "underline",
                        },
                        transition: "color 0.3s ease",
                    }}
                >
                    Đăng ký tài khoản
                </MuiLink>
            </Box>
        </Box>
    );
};
