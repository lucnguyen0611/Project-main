import React, { useState } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    Alert,
    CircularProgress,
    Link as MuiLink,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    InputAdornment,
    IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "@/contexts";
import {
    validateEmail,
    validatePassword,
    validateName,
    validateRequired,
} from "@/utils/validation.utils";

interface RegisterFormProps {
    onSwitchToLogin?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
    onSwitchToLogin,
}) => {
    const { register, isLoading, error, clearError } = useAuth();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "student" as "student" | "teacher",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [validationErrors, setValidationErrors] = useState<{
        name?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
        role?: string;
    }>({});

    const validateForm = (): boolean => {
        const errors: typeof validationErrors = {};

        // Validate name
        const nameValidation = validateName(formData.name);
        if (!nameValidation.isValid) {
            errors.name = nameValidation.errors[0];
        }

        // Validate email
        const emailValidation = validateRequired(formData.email, "Email");
        if (!emailValidation.isValid) {
            errors.email = emailValidation.errors[0];
        } else if (!validateEmail(formData.email)) {
            errors.email = "Email không hợp lệ";
        }

        // Validate password
        const passwordValidation = validatePassword(formData.password);
        if (!passwordValidation.isValid) {
            errors.password = passwordValidation.errors[0];
        }

        // Validate confirm password
        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = "Mật khẩu xác nhận không khớp";
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));

        // Clear validation error when user starts typing
        if (validationErrors[field as keyof typeof validationErrors]) {
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

    const handleClickShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
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
            await register(
                formData.name,
                formData.email,
                formData.password,
                formData.role
            );
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
            {/* Error alert */}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
                    {error}
                </Alert>
            )}

            <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Họ và tên *"
                name="name"
                autoComplete="name"
                autoFocus
                variant="outlined"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                error={!!validationErrors.name}
                helperText={validationErrors.name}
                disabled={isLoading}
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
                id="email"
                label="Email *"
                name="email"
                type="email"
                autoComplete="email"
                variant="outlined"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                error={!!validationErrors.email}
                helperText={validationErrors.email}
                disabled={isLoading}
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
                label="Mật khẩu *"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="new-password"
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

            <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Xác nhận mật khẩu *"
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                }
                error={!!validationErrors.confirmPassword}
                helperText={validationErrors.confirmPassword}
                disabled={isLoading}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle confirm password visibility"
                                onClick={handleClickShowConfirmPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                            >
                                {showConfirmPassword ? (
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

            <FormControl
                fullWidth
                margin="normal"
                error={!!validationErrors.role}
                disabled={isLoading}
            >
                <InputLabel>Vai trò *</InputLabel>
                <Select
                    value={formData.role}
                    label="Vai trò *"
                    onChange={(e) => handleInputChange("role", e.target.value)}
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
                >
                    <MenuItem value="student">Học sinh</MenuItem>
                    <MenuItem value="teacher">Giáo viên</MenuItem>
                </Select>
                {validationErrors.role && (
                    <FormHelperText>{validationErrors.role}</FormHelperText>
                )}
            </FormControl>

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
                    "ĐĂNG KÝ"
                )}
            </Button>

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Typography variant="body2" color="#666">
                    Đã có tài khoản?{" "}
                    <MuiLink
                        component="button"
                        type="button"
                        variant="body2"
                        onClick={onSwitchToLogin}
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
                        Đăng nhập
                    </MuiLink>
                </Typography>
            </Box>
        </Box>
    );
};
