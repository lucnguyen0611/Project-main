import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { LoginTest } from "@/components/test/LoginTest";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`auth-tabpanel-${index}`}
            aria-labelledby={`auth-tab-${index}`}
            {...other}
        >
            {value === index && <Box>{children}</Box>}
        </div>
    );
}

const LoginPage: React.FC = () => {
    const [tabValue, setTabValue] = useState(0);

    // const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    //     setTabValue(newValue);
    // };

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                maxWidth: "1000px",
                mx: "auto",
                px: 2,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    borderRadius: "16px",
                    overflow: "hidden",
                    width: "100%",
                    maxWidth: "1000px",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
            >
                <Box sx={{ display: "flex", height: "100%" }}>
                    {/* Left Side */}
                    <Box
                        sx={{
                            width: { xs: 0, md: "50%" },
                            backgroundColor: "rgb(49, 130, 206)",
                            color: "#fff",
                            display: { xs: "none", md: "flex" },
                            flexDirection: "column",
                            justifyContent: "flex-end",
                        }}
                    >
                        <img
                            style={{
                                width: "90%",
                                margin: "auto",
                                objectFit: "cover",
                            }}
                            src="https://bk-exam-public.s3.ap-southeast-1.amazonaws.com/loginbg.jpg"
                            alt="background"
                        />
                        <Box sx={{ p: { xs: 3, md: 5 } }}>
                            <Typography variant="h6" fontWeight="bold" mb={1}>
                                GIEO MẦM SÁNG TẠO...
                            </Typography>
                            <Typography
                                variant="h6"
                                fontWeight="bold"
                                textAlign="right"
                            >
                                ... DẪN HƯỚNG ĐAM MÊ
                            </Typography>
                        </Box>
                    </Box>

                    {/* Right Side */}
                    <Box
                        sx={{
                            width: { xs: "100%", md: "50%" },
                            p: { xs: 3, md: 5 },
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            backgroundColor: "rgba(255, 255, 255, 0.95)",
                            backdropFilter: "blur(10px)",
                        }}
                    >
                        {/* Logo */}
                        <Box display="flex" alignItems="center" mb={2}>
                            <Typography
                                variant="h3"
                                component="span"
                                fontWeight="bold"
                                color="#173054"
                            >
                                BK
                                <Typography
                                    component="span"
                                    variant="h3"
                                    fontWeight="bold"
                                    color="#f7a41d"
                                >
                                    Star
                                </Typography>
                            </Typography>
                        </Box>

                        <Typography
                            component="h1"
                            variant="h5"
                            fontWeight="bold"
                            mb={1}
                            color="#173054"
                        >
                            {tabValue === 0 ? "Đăng Nhập" : "Đăng Ký"}
                        </Typography>
                        <Typography
                            variant="body2"
                            mb={3}
                            color="#666"
                            textAlign="center"
                        >
                            Cung cấp giải pháp toàn diện cho <br /> lớp học
                            thông minh
                        </Typography>

                        {/* FORM */}
                        <TabPanel value={tabValue} index={0}>
                            <LoginForm
                                onSwitchToRegister={() => setTabValue(1)}
                            />
                            {/* Temporary test component */}
                            <Box
                                sx={{
                                    mt: 3,
                                    pt: 2,
                                    borderTop: "1px solid #eee",
                                }}
                            >
                                <LoginTest />
                            </Box>
                        </TabPanel>

                        <TabPanel value={tabValue} index={1}>
                            <RegisterForm
                                onSwitchToLogin={() => setTabValue(0)}
                            />
                        </TabPanel>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default LoginPage;
