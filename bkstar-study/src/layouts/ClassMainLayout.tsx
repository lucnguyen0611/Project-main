import React, { useMemo } from "react";
import {
    Box,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PeopleIcon from "@mui/icons-material/People";
import { Link, useParams, useLocation } from "react-router-dom";
import { cloneElement, isValidElement } from "react";
import type { SvgIconProps } from "@mui/material";
import { Header } from "@/components";
import { Outlet } from 'react-router-dom';

type MenuItem = {
    text: string;
    path: string;
    segment?: string;
    icon: React.ReactElement<SvgIconProps>;
};

const ClassMainLayout: React.FC = () => {
    const { classId: classIdParam } = useParams<{ classId?: string }>();
    const classId = Number(classIdParam ?? NaN);
    const location = useLocation();

    const menuItems = useMemo<MenuItem[]>(
        () => [
            {
                text: "Tổng quan",
                path: `/class/${classId}`,
                segment: undefined,
                icon: <DashboardIcon />,
            },
            {
                text: "Bài thi",
                path: `/class/${classId}/exam`,
                segment: "exam",
                icon: <AssignmentIcon />,
            },
            {
                text: "Thành viên",
                path: `/class/${classId}/members`,
                segment: "members",
                icon: <PeopleIcon />,
            },
        ],
        [classId]
    );

    const isActive = (pathSegment?: string) => {
        if (!classId) return false;

        const basePath = `/class/${classId}`;
        const currentPath =
            location.pathname.endsWith("/") && location.pathname.length > 1
                ? location.pathname.slice(0, -1)
                : location.pathname;

        if (!pathSegment) {
            return currentPath === basePath;
        }
        return currentPath === `${basePath}/${pathSegment}`;
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
            }}
        >
            <Header />
            <Box>
                <Toolbar />
                <Box
                    sx={{
                        width: "100%",
                        display: "flex",
                        backgroundColor: "#f5f5f5",
                        alignItems: "stretch",
                    }}
                >
                    {/* Sidebar */}
                    <Box
                        sx={{
                            flex: "0 0 260px",
                            bgcolor: "background.paper",
                            display: { xs: "none", md: "flex" },
                            flexDirection: "column",
                            justifyContent: "space-between",
                            position: "sticky",
                            top: { xs: "56px", md: "64px" },
                            height: { xs: "calc(100vh - 56px)", md: "calc(100vh - 64px)" },
                            overflowY: "auto",
                            boxShadow: "0 0 8px rgba(0,0,0,0.04)",
                        }}
                    >
                        <List component="nav" aria-label="main mailbox folders">
                            {menuItems.map((item) => {
                                const active = isActive(item.segment);
                                // item.icon được typed là React.ReactElement nên cloneElement hợp lệ.
                                // Tuy nhiên vẫn kiểm tra isValidElement để an toàn runtime.
                                const iconNode = isValidElement(item.icon)
                                    ? cloneElement(item.icon, { color: active ? "primary" : "action" })
                                    : item.icon;

                                return (
                                    <ListItemButton key={item.text} component={Link} to={item.path} selected={active}>
                                        <ListItemIcon>{iconNode}</ListItemIcon>
                                        <ListItemText
                                            primary={item.text}
                                            slotProps={{
                                                primary: {
                                                    color: active ? "primary" : "action",
                                                },
                                            }}
                                        />
                                    </ListItemButton>
                                );
                            })}
                        </List>

                        <CopyrightInfo />
                    </Box>

                    {/* Main content */}
                    <Box
                        component="main"
                        sx={{
                            flex: 1,
                            minWidth: 0,
                            p: 3,
                            height: { xs: "calc(100vh - 56px)", md: "calc(100vh - 64px)" },
                            overflowY: "auto",
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            bgcolor: "#f7f7f900"
                        }}
                    >
                        <Outlet/>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

function CopyrightInfo() {
    return (
        <Box sx={{ p: 2, mt: "auto" }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", textAlign: "center" }}>
                ©2024 Allrights reserved
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", textAlign: "center" }}>
                BKStar
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", textAlign: "center" }}>
                Version 1.3.1
            </Typography>
        </Box>
    );
}

export default ClassMainLayout;
