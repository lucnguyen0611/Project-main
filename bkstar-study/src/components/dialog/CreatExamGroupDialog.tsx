import React, { useEffect, useState } from "react";
import { TextField, Box, Alert } from "@mui/material";
import DialogContainer from "@/components/dialog/DialogContainer.tsx"; // cập nhật path nếu cần

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
    initialData?: { name?: string; awaitTime?: number; startDate?: string }; // awaitTime in seconds (server) or minutes? we assume seconds
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
    const [formData, setFormData] = useState<{ name: string; awaitTimeMin: number | ""; startDate: string }>({
        name: "",
        awaitTimeMin: 0,
        startDate: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Prefill when dialog opens
    useEffect(() => {
        if (isOpen) {
            const rawAwait = initialData?.awaitTime ?? 0;
            const awaitMin = Number(rawAwait) ? Number(rawAwait) / 60 : 0;
            setFormData({
                name: initialData?.name ?? "",
                awaitTimeMin: awaitMin,
                startDate: initialData?.startDate ?? "",
            });
            setError(null);
        } else {
            setFormData({ name: "", awaitTimeMin: 0, startDate: "" });
            setError(null);
            setSubmitting(false);
        }
    }, [isOpen, initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "awaitTimeMin" ? (value === "" ? "" : Number(value)) : value,
        }));
    };

    const validate = (): string | null => {
        if (!formData.name || !formData.name.trim()) return "Tên không được để trống";
        if (formData.awaitTimeMin === "" || Number.isNaN(Number(formData.awaitTimeMin))) return "Thời gian chờ phải là số";
        if (!formData.startDate) return "Vui lòng chọn ngày bắt đầu";
        if (Number(formData.awaitTimeMin) < 0) return "Thời gian chờ không được âm";
        return null;
    };

    // function called by DialogContainer when user clicks "Lưu"
    const handleSave = async () => {
        setError(null);
        const v = validate();
        if (v) {
            setError(v);
            return;
        }

        setSubmitting(true);
        try {
            const payload: DialogPayload = {
                name: formData.name.trim(),
                awaitTime: Math.round(Number(formData.awaitTimeMin) * 60), // convert minutes -> seconds
                startDate: formData.startDate,
            };

            await onSubmit(payload);
            // parent is responsible for closing the dialog on success
        } catch (err: any) {
            console.error("Submit error:", err);
            setError(err?.message || "Thao tác thất bại");
        } finally {
            setSubmitting(false);
        }
    };

    // combine external loading + internal submitting
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

                <TextField
                    fullWidth
                    margin="normal"
                    label="Tên"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                />

                <TextField
                    fullWidth
                    margin="normal"
                    label="Thời gian chờ (phút)"
                    name="awaitTimeMin"
                    value={formData.awaitTimeMin}
                    onChange={handleChange}
                    type="number"
                    inputProps={{ min: 0 }}
                />

                <TextField
                    fullWidth
                    margin="normal"
                    label="Ngày bắt đầu"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                />
            </Box>
        </DialogContainer>
    );
}
