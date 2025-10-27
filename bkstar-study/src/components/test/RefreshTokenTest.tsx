import React, { useState } from "react";
import {
    Box,
    Button,
    Typography,
    TextField,
    Paper,
    Alert,
    CircularProgress,
    Divider,
} from "@mui/material";
import {
    Refresh as RefreshIcon,
    Science as TestIcon,
} from "@mui/icons-material";
import { testRefreshToken, testTokenExpiry } from "@/utils/test-refresh-token";
import { getAccessToken, getRefreshToken } from "@/utils/storage.utils";

export const RefreshTokenTest: React.FC = () => {
    const [refreshToken, setRefreshToken] = useState("");
    const [testResult, setTestResult] = useState<any>(null);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleTestRefreshToken = async () => {
        if (!refreshToken.trim()) {
            setError("Vui lòng nhập refresh token");
            return;
        }

        setLoading(true);
        setError(null);
        setTestResult(null);

        try {
            const result = await testRefreshToken(refreshToken);
            setTestResult(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Lỗi không xác định");
        } finally {
            setLoading(false);
        }
    };

    const handleTestCurrentTokens = () => {
        const accessToken = getAccessToken();
        const refreshToken = getRefreshToken();

        if (!accessToken) {
            setError("Không có access token");
            return;
        }
        // Test current tokens
        console.log("Testing current tokens...");
        console.log("Access token:", accessToken);
        console.log("Refresh token:", refreshToken);

        const expiryInfo = testTokenExpiry(accessToken);
        setTestResult({
            type: "token_analysis",
            accessToken: accessToken ? "Có" : "Không có",
            refreshToken: refreshToken ? "Có" : "Không có",
            expiryInfo,
        });
    };

    const handleAutoRefresh = async () => {
        const currentRefreshToken = getRefreshToken();
        if (!currentRefreshToken) {
            setError("Không có refresh token trong storage");
            return;
        }

        setLoading(true);
        setError(null);
        setTestResult(null);

        try {
            const result = await testRefreshToken(currentRefreshToken);
            setTestResult(result);

            if (result.success) {
                // Có thể thêm logic để cập nhật token mới vào storage
                console.log("Auto refresh thành công:", result);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Lỗi không xác định");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
            <Typography variant="h4" gutterBottom>
                 Test Refresh Token
            </Typography>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Test Refresh Token API
                </Typography>

                <Box sx={{ mb: 2 }}>
                    <TextField
                        fullWidth
                        label="Refresh Token"
                        value={refreshToken}
                        onChange={(e) => setRefreshToken(e.target.value)}
                        placeholder="Nhập refresh token để test"
                        multiline
                        rows={3}
                        sx={{ mb: 2 }}
                    />

                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                        <Button
                            variant="contained"
                            startIcon={<TestIcon />}
                            onClick={handleTestRefreshToken}
                            disabled={isLoading || !refreshToken.trim()}
                        >
                            Test Refresh Token
                        </Button>

                        <Button
                            variant="outlined"
                            startIcon={<RefreshIcon />}
                            onClick={handleAutoRefresh}
                            disabled={isLoading}
                        >
                            Auto Refresh (Từ Storage)
                        </Button>

                        <Button
                            variant="outlined"
                            onClick={handleTestCurrentTokens}
                        >
                            Phân Tích Token Hiện Tại
                        </Button>
                    </Box>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {isLoading && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <CircularProgress size={20} />
                        <Typography>Đang test...</Typography>
                    </Box>
                )}
            </Paper>

            {testResult && (
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Kết Quả Test
                    </Typography>

                    <Divider sx={{ mb: 2 }} />

                    {testResult.type === "token_analysis" ? (
                        <Box>
                            <Typography variant="body1" gutterBottom>
                                <strong>Access Token:</strong>{" "}
                                {testResult.accessToken}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>Refresh Token:</strong>{" "}
                                {testResult.refreshToken}
                            </Typography>

                            {testResult.expiryInfo && (
                                <Box
                                    sx={{
                                        mt: 2,
                                        p: 2,
                                        bgcolor: "grey.50",
                                        borderRadius: 1,
                                    }}
                                >
                                    <Typography
                                        variant="subtitle2"
                                        gutterBottom
                                    >
                                        Thông Tin Token:
                                    </Typography>
                                    <Typography variant="body2">
                                        Thời gian còn lại:{" "}
                                        {
                                            testResult.expiryInfo
                                                .minutesUntilExpiry
                                        }{" "}
                                        phút
                                    </Typography>
                                    <Typography variant="body2">
                                        Sắp hết hạn:{" "}
                                        {testResult.expiryInfo.isExpiringSoon
                                            ? "Có"
                                            : "Không"}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    ) : (
                        <Box>
                            <Typography variant="body1" gutterBottom>
                                <strong>Trạng thái:</strong>{" "}
                                {testResult.success
                                    ? "Thành công"
                                    : "Thất bại"}
                            </Typography>

                            {testResult.success ? (
                                <Box>
                                    <Typography variant="body1" gutterBottom>
                                        <strong>Access Token:</strong>{" "}
                                        {testResult.accessToken
                                            ? "Có"
                                            : "Không có"}
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        <strong>Refresh Token:</strong>{" "}
                                        {testResult.refreshToken
                                            ? "Có"
                                            : "Không có"}
                                    </Typography>

                                    <Box
                                        sx={{
                                            mt: 2,
                                            p: 2,
                                            bgcolor: "success.light",
                                            borderRadius: 1,
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            color="success.contrastText"
                                        >
                                            Refresh token thành công! Token mới
                                            đã được nhận.
                                        </Typography>
                                    </Box>
                                </Box>
                            ) : (
                                <Box
                                    sx={{
                                        mt: 2,
                                        p: 2,
                                        bgcolor: "error.light",
                                        borderRadius: 1,
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                        color="error.contrastText"
                                    >
                                        Lỗi: {testResult.error}
                                    </Typography>
                                    {testResult.status && (
                                        <Typography
                                            variant="body2"
                                            color="error.contrastText"
                                        >
                                            Status: {testResult.status}
                                        </Typography>
                                    )}
                                </Box>
                            )}
                        </Box>
                    )}
                </Paper>
            )}

            <Paper sx={{ p: 3, mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Hướng Dẫn Sử Dụng
                </Typography>

                <Typography variant="body2" paragraph>
                    1. <strong>Test Refresh Token:</strong> Nhập refresh token
                    và test API endpoint
                </Typography>

                <Typography variant="body2" paragraph>
                    2. <strong>Auto Refresh:</strong> Sử dụng refresh token từ
                    storage hiện tại
                </Typography>

                <Typography variant="body2" paragraph>
                    3. <strong>Phân Tích Token:</strong> Kiểm tra thông tin
                    token hiện tại trong storage
                </Typography>

                <Typography variant="body2" paragraph>
                    4. <strong>API Endpoint:</strong> POST /auth/refresh/
                    với payload{" "}
                    {"&lbrace;&quot;refresh&quot;: &quot;string&quot;&rbrace;"}
                </Typography>
            </Paper>
        </Box>
    );
};

export default RefreshTokenTest;
