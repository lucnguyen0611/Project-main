import React, { useState, useEffect } from "react";
import {
    Box,
    Card,
    Container,
    Typography,
    CircularProgress,
    Alert,
} from "@mui/material";
import { Header } from "@/components/common/Header";
import {
    // ProfileAvatar,
    PersonalInfoForm,
    ChangePasswordForm,
} from "@/components/profile";
import { profileApi } from "@/api/profile.api";
import { useAuth, useToast } from "@/contexts";
import type { ProfileData, UpdateProfileRequest } from "@/types/profile.types";

const ProfilePage: React.FC = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [updatingProfile, setUpdatingProfile] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        if (user?.id) {
            loadProfile();
        }
    }, [user?.id]);

    const loadProfile = async () => {
        try {
            setLoading(true);
            setError(null);

            // Call real API to get profile data
            const data = await profileApi.getProfile(user!.id);
            setProfileData(data);
        } catch (err: any) {
            setError("Không thể tải thông tin profile");
            console.error("Error loading profile:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (data: UpdateProfileRequest) => {
        try {
            setUpdatingProfile(true);
            setError(null);
            setSuccessMessage(null);

            // Avatar data is already prepared in PersonalInfoForm
            const updateData: UpdateProfileRequest = data;

            // Call real API to update profile
            const updatedProfile = await profileApi.updateProfile(
                user!.id,
                updateData
            );
            setProfileData(updatedProfile);
            setSuccessMessage("Cập nhật thông tin thành công!");

            // Show toast
            showToast("Cập nhật thông tin thành công!", "success");
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.message ||
                err.message ||
                "Cập nhật thông tin thất bại";
            setError(errorMessage);

            // Show toast
            showToast(errorMessage, "error");
        } finally {
            setUpdatingProfile(false);
        }
    };

    const handleChangePassword = async (data: {
        id: number;
        old_password: string;
        new_password: string;
    }) => {
        try {
            setChangingPassword(true);
            setError(null);
            setSuccessMessage(null);

            // Encode passwords to Base64
            const encodedData = {
                id: data.id,
                old_password: btoa(
                    unescape(encodeURIComponent(data.old_password))
                ),
                new_password: btoa(
                    unescape(encodeURIComponent(data.new_password))
                ),
            };

            // Call real API to change password
            await profileApi.changePassword(encodedData);
            setSuccessMessage("Đổi mật khẩu thành công!");

            // Show toast
            showToast("Đổi mật khẩu thành công!", "success");
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.message ||
                err.message ||
                "Đổi mật khẩu thất bại";
            setError(errorMessage);

            // Show toast
            showToast(errorMessage, "error");
        } finally {
            setChangingPassword(false);
        }
    };

    if (loading) {
        return (
            <Box>
                <Header />
                <Container maxWidth="md" sx={{ py: 4 }}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            py: 8,
                        }}
                    >
                        <CircularProgress />
                    </Box>
                </Container>
            </Box>
        );
    }

    if (!profileData) {
        return (
            <Box>
                <Header />
                <Container maxWidth="md" sx={{ py: 4 }}>
                    <Alert severity="error">
                        Không thể tải thông tin profile
                    </Alert>
                </Container>
            </Box>
        );
    }

    return (
        <Box sx={{ bgcolor: "grey.50", minHeight: "100vh" }}>
            <Header />
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                    sx={{ mb: 4 }}
                >
                    Hồ sơ cá nhân
                </Typography>

                {error && (
                    <Alert
                        severity="error"
                        sx={{ mb: 3 }}
                        onClose={() => setError(null)}
                    >
                        {error}
                    </Alert>
                )}

                {successMessage && (
                    <Alert
                        severity="success"
                        sx={{ mb: 3 }}
                        onClose={() => setSuccessMessage(null)}
                    >
                        {successMessage}
                    </Alert>
                )}

                {/* Personal Information Section */}
                <Card sx={{ p: 4, mb: 4, position: "relative" }}>
                    <Box
                        sx={{
                            bgcolor: "transparent",
                            color: "text.primary",
                            mb: 3,
                            fontSize: "1rem",
                            fontWeight: "bold",
                        }}
                    >
                        Thông tin cá nhân
                    </Box>
                    <PersonalInfoForm
                        profileData={profileData}
                        onSubmit={handleUpdateProfile}
                        loading={updatingProfile}
                    />
                </Card>

                {/* Change Password Section */}
                <Card sx={{ p: 4, position: "relative" }}>
                    <Box
                        sx={{
                            bgcolor: "transparent",
                            color: "text.primary",
                            mb: 3,
                            fontSize: "1rem",
                            fontWeight: "bold",
                        }}
                    >
                        Thay đổi mật khẩu
                    </Box>

                    <ChangePasswordForm
                        userId={user!.id}
                        onSubmit={handleChangePassword}
                        loading={changingPassword}
                    />
                </Card>
            </Container>
        </Box>
    );
};

export default ProfilePage;
