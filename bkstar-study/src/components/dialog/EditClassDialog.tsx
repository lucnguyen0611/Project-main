// import DialogContainer from "@/components/dialog/DialogContainer.tsx"; // cập nhật path nếu cần
// import React, {useState} from "react";
// import {validateRequired} from "@/utils";
// import {Box, Button, CircularProgress, TextField} from "@mui/material";
//
// interface EditClassDialogProps {
//     open: boolean;
//     onClose: () => void;
//     onSubmit: (data: { name: string; code: string }) => Promise<void>;
//     onDelete?: () => Promise<void>;
//     loading?: boolean;
//     classData: { name: string; code: string };
// }
//
// export default function EditClassDialog({
//                                             open,
//                                             onClose,
//                                             onSubmit,
//                                             onDelete,
//                                             loading,
//                                             classData,
//                                         }: EditClassDialogProps) {
//     const [formData, setFormData] = useState({
//         name: "",
//         code: "",
//     });
//     const [validationErrors, setValidationErrors] = useState<{
//         name?: string;
//         code?: string;
//     }>({});
//
//     const validateForm = (): boolean => {
//         const errors: typeof validationErrors = {};
//
//         // Validate name
//         const nameValidation = validateRequired(formData.name, "Tên lớp học");
//         if (!nameValidation.isValid) {
//             errors.name = nameValidation.errors[0];
//         }
//
//         // Validate code
//         const codeValidation = validateRequired(formData.code, "Mã bảo vệ");
//         if (!codeValidation.isValid) {
//             errors.code = codeValidation.errors[0];
//         } else if (formData.code.length < 4) {
//             errors.code = "Mã bảo vệ phải có ít nhất 4 ký tự";
//         }
//
//         console.log(errors);
//
//         setValidationErrors(errors);
//         return Object.keys(errors).length === 0;
//     };
//
//     const handleInputChange = (field: string, value: string) => {
//         setFormData((prev) => ({ ...prev, [field]: value }));
//
//         // Clear validation error when user starts typing
//         if (validationErrors[field as keyof typeof validationErrors]) {
//             setValidationErrors((prev) => ({
//                 ...prev,
//                 [field]: undefined,
//             }));
//         }
//     };
//
//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//
//         if (!validateForm()) {
//             return;
//         }
//
//         try {
//             await onSubmit(formData);
//             // Reset form after successful submission
//             setFormData({ name: "", code: "" });
//         } catch (error) {
//             console.log(error);
//         }
//     };
//     return (
//         <DialogContainer
//             isLoading={!!loading}
//             isOpen={open}
//             onClose={onClose}
//             onSave={() => {}}
//             onDelete={onDelete}
//             mode="edit"
//             title="Chỉnh sửa lớp học"
//         >
//             <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }} noValidate>
//                 <TextField
//                     margin="normal"
//                     required
//                     fullWidth
//                     id="name"
//                     label="Tên lớp học"
//                     name="name"
//                     autoComplete="off"
//                     autoFocus
//                     variant="outlined"
//                     value={formData.name}
//                     onChange={(e) => handleInputChange("name", e.target.value)}
//                     error={!!validationErrors.name}
//                     helperText={validationErrors.name}
//                     disabled={loading}
//                     size="small"
//                     sx={{ mb: 2 }}
//                 />
//
//                 <TextField
//                     margin="normal"
//                     required
//                     fullWidth
//                     id="code"
//                     label="Mã bảo vệ"
//                     name="code"
//                     autoComplete="off"
//                     variant="outlined"
//                     value={formData.code}
//                     onChange={(e) => handleInputChange("code", e.target.value)}
//                     error={!!validationErrors.code}
//                     helperText={
//                         validationErrors.code ||
//                         "Mã bảo vệ để học sinh tham gia lớp học"
//                     }
//                     disabled={loading}
//                     size="small"
//                     sx={{ mb: 3 }}
//                 />
//             </Box>
//         </DialogContainer>
//     );
// }

import DialogContainer from "@/components/dialog/DialogContainer.tsx";
import React, { useEffect, useState } from "react";
import { validateRequired } from "@/utils";
import { Box, TextField, Alert } from "@mui/material";

interface EditClassDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: { name: string; code: string }) => Promise<void>;
    onDelete?: () => Promise<void>;
    loading?: boolean;
    classData: { name: string; code: string };
}

export default function EditClassDialog({
                                            open,
                                            onClose,
                                            onSubmit,
                                            onDelete,
                                            loading = false,
                                            classData,
                                        }: EditClassDialogProps) {
    const [formData, setFormData] = useState({ name: "", code: "" });
    const [validationErrors, setValidationErrors] = useState<{ name?: string; code?: string }>({});
    const [error, setError] = useState<string | null>(null); // dialog-level error (server)
    const [submitting, setSubmitting] = useState(false);

    // Prefill form when dialog opens or when classData changes
    useEffect(() => {
        if (open) {
            setFormData({
                name: classData?.name ?? "",
                code: classData?.code ?? "",
            });
            setValidationErrors({});
            setError(null);
        } else {
            // when closed, clear local transient states
            setSubmitting(false);
            setValidationErrors({});
            setError(null);
        }
    }, [open, classData]);

    const validateForm = (): boolean => {
        const errors: typeof validationErrors = {};

        const nameValidation = validateRequired(formData.name, "Tên lớp học");
        if (!nameValidation.isValid) {
            errors.name = nameValidation.errors[0];
        }

        const codeValidation = validateRequired(formData.code, "Mã bảo vệ");
        if (!codeValidation.isValid) {
            errors.code = codeValidation.errors[0];
        } else if (formData.code.length < 4) {
            errors.code = "Mã bảo vệ phải có ít nhất 4 ký tự";
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (field: "name" | "code", value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));

        // Clear validation error when user starts typing
        if (validationErrors[field]) {
            setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
        }

        // Clear dialog-level error when editing
        if (error) setError(null);
    };

    // Called by DialogContainer when user clicks "Lưu"
    const handleSave = async () => {
        setError(null);

        if (!validateForm()) return;

        setSubmitting(true);
        try {
            await onSubmit(formData);
            // don't necessarily reset form here — parent usually closes the dialog on success
            // if parent doesn't close, you can uncomment the reset:
            // setFormData({ name: "", code: "" });
        } catch (err: any) {
            console.error("Edit class submit error:", err);
            // display friendly message
            setError(err?.message || "Cập nhật lớp thất bại");
        } finally {
            setSubmitting(false);
        }
    };

    // Also allow form submit via Enter inside form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await handleSave();
    };

    const effectiveLoading = Boolean(loading) || submitting;

    return (
        <DialogContainer
            isLoading={effectiveLoading}
            isOpen={open}
            onClose={onClose}
            onSave={handleSave}
            onDelete={onDelete}
            mode="edit"
            title="Chỉnh sửa lớp học"
        >
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }} noValidate>
                {error && (
                    <Box mb={2}>
                        <Alert severity="error">{error}</Alert>
                    </Box>
                )}

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
                    disabled={effectiveLoading}
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
                    helperText={validationErrors.code || "Mã bảo vệ để học sinh tham gia lớp học"}
                    disabled={effectiveLoading}
                    size="small"
                    sx={{ mb: 3 }}
                />
            </Box>
        </DialogContainer>
    );
}
