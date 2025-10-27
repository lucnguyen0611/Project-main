import React, { useState } from "react";
import { Box, TextField, Button, CircularProgress } from "@mui/material";
import { validateRequired } from "@/utils/validation.utils";

interface CreateClassFormProps {
    onSubmit: (data: { name: string; code: string }) => Promise<void>;
    onCancel?: () => void;
    loading?: boolean;
}

export const CreateClassForm: React.FC<CreateClassFormProps> = React.memo(
    ({ onSubmit, onCancel, loading = false }) => {
        const [formData, setFormData] = useState({
            name: "",
            code: "",
        });
        const [validationErrors, setValidationErrors] = useState<{
            name?: string;
            code?: string;
        }>({});

        const validateForm = (): boolean => {
            const errors: typeof validationErrors = {};

            // Validate name
            const nameValidation = validateRequired(formData.name, "Tên lớp học");
            if (!nameValidation.isValid) {
                errors.name = nameValidation.errors[0];
            }

            // Validate code
            const codeValidation = validateRequired(formData.code, "Mã bảo vệ");
            if (!codeValidation.isValid) {
                errors.code = codeValidation.errors[0];
            } else if (formData.code.length < 4) {
                errors.code = "Mã bảo vệ phải có ít nhất 4 ký tự";
            }

            console.log(errors);

            setValidationErrors(errors);
            return Object.keys(errors).length === 0;
        };

        const handleInputChange = (field: string, value: string) => {
            setFormData((prev) => ({ ...prev, [field]: value }));

            // Clear validation error when user starts typing
            if (validationErrors[field as keyof typeof validationErrors]) {
                setValidationErrors((prev) => ({
                    ...prev,
                    [field]: undefined,
                }));
            }
        };

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();

            if (!validateForm()) {
                return;
            }

            try {
                await onSubmit(formData);
                // Reset form after successful submission
                setFormData({ name: "", code: "" });
            } catch (error) {
               console.log(error);
            }
        };

        return (
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }} noValidate>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="name"
                    label="Tên lớp học"
                    name="name"
                    autoComplete="off"
                    autoFocus
                    variant="outlined"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    error={!!validationErrors.name}
                    helperText={validationErrors.name}
                    disabled={loading}
                    size="small"
                    sx={{ mb: 2 }}
                />

                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="code"
                    label="Mã bảo vệ"
                    name="code"
                    autoComplete="off"
                    variant="outlined"
                    value={formData.code}
                    onChange={(e) => handleInputChange("code", e.target.value)}
                    error={!!validationErrors.code}
                    helperText={
                        validationErrors.code ||
                        "Mã bảo vệ để học sinh tham gia lớp học"
                    }
                    disabled={loading}
                    size="small"
                    sx={{ mb: 3 }}
                />

                <Box
                    sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}
                >
                    {onCancel && (
                        <Button
                            variant="outlined"
                            onClick={onCancel}
                            disabled={loading}
                            sx={{
                                borderColor: "#1976d2",
                                color: "#1976d2",
                                "&:hover": {
                                    borderColor: "#1565c0",
                                    backgroundColor: "rgba(25, 118, 210, 0.04)",
                                },
                            }}
                        >
                            Hủy
                        </Button>
                    )}
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        sx={{
                            backgroundColor: "#1976d2",
                            "&:hover": { backgroundColor: "#1565c0" },
                        }}
                    >
                        {loading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            "Tạo lớp học"
                        )}
                    </Button>
                </Box>
            </Box>
        );
    }
);