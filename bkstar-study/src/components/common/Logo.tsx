import React from 'react';
import { Box, Typography } from '@mui/material';

export const CustomLogoIcon: React.FC = () => {
  return (
    <Box
        sx={{ flex: 1, display: "flex", alignItems: "center", gap: 1 }}
    >
        <img
            src="https://bk-exam-public.s3.ap-southeast-1.amazonaws.com/logo2.png"
            alt="logo"
            style={{ height: 30 }}
        />
        <Box textAlign="left">
            <Typography
                 variant="h6"
                component="div"
                sx={{ fontWeight: 700, letterSpacing: ".05rem", lineHeight: 1.2 }}
            >
                <span style={{ color: "#0b3d91" }}>BK</span>
                <span style={{ color: "#ff8c00" }}>Star</span>
            </Typography>
            <Typography variant="caption" color="text.secondary">
                Classroom
            </Typography>
        </Box>
    </Box>
  );
};
