import { useEffect, useState } from "react";
import { TextField, Box, Alert } from "@mui/material";
import DialogContainer from "@/components/dialog/DialogContainer.tsx";
import { validateRequired } from "@/utils/validation.utils";

interface DialogPayload {
    name: string;
    awaitTime: number;
    startDate: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (payload: DialogPayload) => Promise<void>;
    isLoading?: boolean;
    initialData?: { name?: string; awaitTime?: number; startDate?: string };
    dialogTitle?: string;
    mode?: "create" | "edit";
    onDelete?: () => void;
}

export default function CreateExamGroupDialog({
                                                  isOpen,
                                                  onClose,
                                                  onSubmit,
                                                  isLoading = false,
                                                  initialData,
                                                  dialogTitle,
                                                  mode = "create",
                                                  onDelete,
                                              }: Props) {
    const [formData, setFormData] = useState<{
        name: string;
        awaitTimeMin: number | "";
        startDate: string;
    }>({
        name: "",
        awaitTimeMin: "",
        startDate: "",
    });

    const [validationErrors, setValidationErrors] = useState<{
        name?: string;
        awaitTimeMin?: string;
        startDate?: string;
    }>({});
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Prefill data when dialog opens
    useEffect(() => {
        if (isOpen) {
            const rawAwait = initialData?.awaitTime ?? 0;
            const awaitMin = Number(rawAwait) ? Number(rawAwait) / 60 : "";
            setFormData({
                name: initialData?.name ?? "",
                awaitTimeMin: awaitMin,
                startDate: initialData?.startDate ?? "",
            });
            setValidationErrors({});
            setError(null);
        } else {
            setFormData({ name: "", awaitTimeMin: "", startDate: "" });
            setValidationErrors({});
            setError(null);
            setSubmitting(false);
        }
    }, [isOpen, initialData]);

    /** Validate form fields */
    const validateForm = (): boolean => {
        const errors: typeof validationErrors = {};

        // validate name
        const nameValidation = validateRequired(formData.name, "Tên bài thi");
        if (!nameValidation.isValid) {
            errors.name = nameValidation.errors[0];
        }

        // validate awaitTimeMin
        if (formData.awaitTimeMin === "" || Number(formData.awaitTimeMin) <= 0) {
            errors.awaitTimeMin = "Thời gian chờ phải lớn hơn 0";
        }

        // validate startDate
        const dateValidation = validateRequired(formData.startDate, "Ngày bắt đầu");
        if (!dateValidation.isValid) {
            errors.startDate = dateValidation.errors[0];
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    /** Update field & clear error */
    const handleInputChange = (field: string, value: string | number) => {
        setFormData((prev) => ({ ...prev, [field]: value }));

        if (validationErrors[field as keyof typeof validationErrors]) {
            setValidationErrors((prev) => ({
                ...prev,
                [field]: undefined,
            }));
        }
    };

    /** Submit logic */
    const handleSave = async () => {
        setError(null);

        if (!validateForm()) return;

        setSubmitting(true);
        try {
            const payload: DialogPayload = {
                name: formData.name.trim(),
                awaitTime: Math.round(Number(formData.awaitTimeMin) * 60),
                startDate: formData.startDate,
            };
            await onSubmit(payload);
        } catch (err: any) {
            console.error("Submit error:", err);
            setError(err?.message || "Thao tác thất bại");
        } finally {
            setSubmitting(false);
        }
    };

    const effectiveLoading = Boolean(isLoading) || submitting;

    return (
        <DialogContainer
            isLoading={effectiveLoading}
            isOpen={isOpen}
            onClose={onClose}
            onSave={handleSave}
            onDelete={onDelete}
            mode={mode}
            width={600}
            title={dialogTitle ?? (mode === "create" ? "Tạo bài thi" : "Chỉnh sửa bài thi")}
        >
            <Box>
                {error && (
                    <Box mb={2}>
                        <Alert severity="error">{error}</Alert>
                    </Box>
                )}

                {/* Tên bài thi */}
                <TextField
                    fullWidth
                    required
                    margin="normal"
                    label="Tên bài thi"
                    name="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    error={!!validationErrors.name}
                    helperText={validationErrors.name}
                    disabled={effectiveLoading}
                    size="small"
                />

                {/* Thời gian chờ */}
                <TextField
                    fullWidth
                    required
                    margin="normal"
                    label="Thời gian chờ (phút)"
                    name="awaitTimeMin"
                    type="number"
                    inputProps={{ min: 1 }}
                    value={formData.awaitTimeMin}
                    onChange={(e) => handleInputChange("awaitTimeMin", e.target.value)}
                    error={!!validationErrors.awaitTimeMin}
                    helperText={validationErrors.awaitTimeMin}
                    disabled={effectiveLoading}
                    size="small"
                />

                {/* Ngày bắt đầu */}
                <TextField
                    fullWidth
                    required
                    margin="normal"
                    label="Ngày bắt đầu"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange("startDate", e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    error={!!validationErrors.startDate}
                    helperText={validationErrors.startDate}
                    disabled={effectiveLoading}
                    size="small"
                />
            </Box>
        </DialogContainer>
    );
}
