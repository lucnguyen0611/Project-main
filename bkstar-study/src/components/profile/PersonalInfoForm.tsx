import React, { useState, useEffect } from "react";
import {
    Box,
    TextField,
    Button,
    Alert,
    Avatar,
    IconButton,
} from "@mui/material";
import {
    PhotoCamera as PhotoCameraIcon,
    Delete as DeleteIcon,
} from "@mui/icons-material";
import type { ProfileData, UpdateProfileRequest } from "@/types/profile.types";
import { validateProfileData, fileToBase64 } from "@/utils/profile.utils";

interface PersonalInfoFormProps {
    profileData: ProfileData;
    onSubmit: (data: UpdateProfileRequest) => Promise<void>;
    loading: boolean;
}

export const PersonalInfoForm: React.FC<PersonalInfoFormProps> = React.memo(
    ({ profileData, onSubmit, loading }) => {
        const [formData, setFormData] = useState<UpdateProfileRequest>({
            name: profileData.name || "",
            email: profileData.email || "",
            school: profileData.school || "",
            parent_name: profileData.parent_name || "",
            parent_phone: profileData.parent_phone || "",
            avata: profileData.avata || null,
        });

        const [errors, setErrors] = useState<Record<string, string>>({});
        const [submitError, setSubmitError] = useState<string | null>(null);
        const [selectedAvatarFile, setSelectedAvatarFile] =
            useState<File | null>(null);
        const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(
            null
        );

        useEffect(() => {
            setFormData({
                name: profileData.name || "",
                email: profileData.email || "",
                school: profileData.school || "",
                parent_name: profileData.parent_name || "",
                parent_phone: profileData.parent_phone || "",
                avata: profileData.avata || null,
            });

            // Set avatar preview if exists
            if (profileData.avata?.url) {
                setAvatarPreviewUrl(profileData.avata.url);
            }
        }, [profileData]);

        const handleInputChange = (
            field: keyof UpdateProfileRequest,
            value: string
        ) => {
            setFormData((prev) => ({ ...prev, [field]: value }));

            // Clear error when user starts typing
            if (errors[field]) {
                setErrors((prev) => ({ ...prev, [field]: "" }));
            }
        };

        const handleAvatarChange = (
            event: React.ChangeEvent<HTMLInputElement>
        ) => {
            const file = event.target.files?.[0];
            if (file) {
                // Validate file type
                if (!file.type.startsWith("image/")) {
                    setSubmitError("Vui lòng chọn file ảnh");
                    return;
                }

                // Validate file size (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    setSubmitError("Kích thước ảnh không được vượt quá 5MB");
                    return;
                }

                setSelectedAvatarFile(file);

                // Create preview URL
                const url = URL.createObjectURL(file);
                setAvatarPreviewUrl(url);

                // Clear any previous errors
                setSubmitError(null);
            }
        };

        const handleAvatarRemove = () => {
            setSelectedAvatarFile(null);
            setAvatarPreviewUrl(null);
            setSubmitError(null);
        };

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            setSubmitError(null);

            // Validate form data
            const validationErrors = validateProfileData({
                name: formData.name,
                school: formData.school,
                parent_name: formData.parent_name,
                parent_phone: formData.parent_phone,
            });

            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors as Record<string, string>);
                return;
            }

            try {
                // Prepare avatar data if file is selected
                let avatarData = formData.avata;
                if (selectedAvatarFile) {
                    // Convert file to base64
                    const base64Data = await fileToBase64(selectedAvatarFile);
                    avatarData = {
                        id: Date.now(),
                        url: avatarPreviewUrl || "",
                        payload: base64Data,
                    };
                }

                const updateData: UpdateProfileRequest = {
                    ...formData,
                    avata: avatarData,
                };

                await onSubmit(updateData);

                // Clear errors and reset avatar selection on success
                setErrors({});
                setSelectedAvatarFile(null);
            } catch (error: any) {
                setSubmitError(
                    error.message || "Có lỗi xảy ra khi cập nhật thông tin"
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

                {/* Avatar Section */}
                <Box sx={{ mb: 3, textAlign: "center" }}>
                    <Avatar
                        src={avatarPreviewUrl || profileData.avata?.url || ""}
                        sx={{
                            width: 100,
                            height: 100,
                            mx: "auto",
                            mb: 2,
                            border: "3px solid #e0e0e0",
                        }}
                    />
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            gap: 1,
                        }}
                    >
                        <input
                            accept="image/*"
                            style={{ display: "none" }}
                            id="avatar-upload"
                            type="file"
                            onChange={handleAvatarChange}
                        />
                        <label htmlFor="avatar-upload">
                            <IconButton
                                color="primary"
                                component="span"
                                sx={{ border: "1px solid #1976d2" }}
                            >
                                <PhotoCameraIcon />
                            </IconButton>
                        </label>
                        {(selectedAvatarFile || avatarPreviewUrl) && (
                            <IconButton
                                color="error"
                                onClick={handleAvatarRemove}
                                sx={{ border: "1px solid #d32f2f" }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        )}
                    </Box>
                </Box>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                    {/* Left Column - 50% width on medium+ screens, full width on small screens */}
                    <Box
                        sx={{
                            flex: {
                                xs: "1 1 100%",
                                md: "1 1 calc(50% - 12px)",
                            },
                        }}
                    >
                        <TextField
                            fullWidth
                            label="Tên của bạn *"
                            value={formData.name}
                            onChange={(e) =>
                                handleInputChange("name", e.target.value)
                            }
                            error={!!errors.name}
                            helperText={errors.name}
                            required
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            fullWidth
                            label="Trường"
                            value={formData.school}
                            onChange={(e) =>
                                handleInputChange("school", e.target.value)
                            }
                            error={!!errors.school}
                            helperText={errors.school}
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            fullWidth
                            label="Số điện thoại phụ huynh"
                            value={formData.parent_phone}
                            onChange={(e) =>
                                handleInputChange(
                                    "parent_phone",
                                    e.target.value
                                )
                            }
                            error={!!errors.parent_phone}
                            helperText={
                                errors.parent_phone || "Định dạng: 9-10 số"
                            }
                            placeholder="0123456789"
                            sx={{ mb: 2 }}
                        />
                    </Box>

                    {/* Right Column - 50% width on medium+ screens, full width on small screens */}
                    <Box
                        sx={{
                            flex: {
                                xs: "1 1 100%",
                                md: "1 1 calc(50% - 12px)",
                            },
                        }}
                    >
                        <TextField
                            fullWidth
                            label="Email"
                            value={formData.email}
                            disabled
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            fullWidth
                            label="Tên phụ huynh"
                            value={formData.parent_name}
                            onChange={(e) =>
                                handleInputChange("parent_name", e.target.value)
                            }
                            error={!!errors.parent_name}
                            helperText={errors.parent_name}
                            sx={{ mb: 2 }}
                        />
                    </Box>
                </Box>

                <Box
                    sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}
                >
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        sx={{ minWidth: 120 }}
                    >
                        {loading ? "Đang lưu..." : "LƯU LẠI"}
                    </Button>
                </Box>
            </Box>
        );
    }
);
