import React from "react";
import { Box, CircularProgress } from "@mui/material";

export const ClassListLoading: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "50vh",
      }}
    >
      <CircularProgress />
    </Box>
  );
};
