import React, { useMemo, useState } from "react";
import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
    Button,
    Avatar,
    Menu,
    MenuItem,
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    CssBaseline,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";
import HomeIcon from "@mui/icons-material/Home";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PeopleIcon from "@mui/icons-material/People";
import { Link as RouterLink, useLocation, useParams, useNavigate } from "react-router-dom";
import { CustomLogoIcon } from "./Logo";
import { useAuth } from "@/contexts";
import { ROUTES } from "@/constants/routes";

const drawerWidth = 280;

export const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { classId: classIdParam } = useParams<Record<string, string>>();
    const classId = classIdParam ? Number(classIdParam) : undefined;

    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

    const userName = user?.name || user?.email || "Người dùng";
    const userRole =
        user?.role === "teacher" ? "Giáo viên" : user?.role === "student" ? "Học sinh" : "Admin";
    const avatarUrl = `https://i.pravatar.cc/40?u=${user?.email || "user"}`;
    const isTeacher = user?.role === "teacher";

    const handleDrawerToggle = () => setMobileOpen((prev) => !prev);
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) =>
        setAnchorElUser(event.currentTarget);
    const handleCloseUserMenu = () => setAnchorElUser(null);

    // menu items trong sidebar
    const menuItems = useMemo(() => {
        if (classId) {
            return [
                { text: "Tổng quan", path: `/class/${classId}`, icon: <DashboardIcon /> },
                { text: "Bài thi", path: `/class/${classId}/exam`, icon: <AssignmentIcon /> },
                { text: "Thành viên", path: `/class/${classId}/members`, icon: <PeopleIcon /> },
            ];
        } else  if (!classId && isTeacher) {
            return [{ text: "Thêm lớp học", path: "/class/add", icon: <DashboardIcon /> }];
        }
        // fallback
        return [{ text: "Trang chủ", path: ROUTES.DASHBOARD || "/", icon: <HomeIcon /> , key: 'home'}]
    }, [classId]);

    const isActive = (path: string) => {
        const normalized = location.pathname.replace(/\/$/, "");
        const target = path.replace(/\/$/, "");

        // nếu path là chính xác trang overview của class thì require exact match
        if (target === `/class/${classId}`) {
            return normalized === target;
        }

        // cho các menu khác: exact OR prefix
        return normalized === target || normalized.startsWith(target + "/");
    };

    const drawer = (
        <Box
            sx={{
                textAlign: "left",
                width: drawerWidth,
                height: "100%",
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* Logo */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, p: 1 }}>
                <CustomLogoIcon />
            </Box>

            <Divider />

            <List sx={{ flexGrow: 1 }}>
                {menuItems.map((item) => (
                    <ListItemButton
                        key={item.text}
                        component={RouterLink}
                        to={item.path}
                        selected={isActive(item.path)}
                        onClick={() => setMobileOpen(false)}
                    >
                        <ListItemIcon>
                            {React.cloneElement(item.icon, {
                                color: isActive(item.path) ? "primary" : "action",
                            })}
                        </ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItemButton>
                ))}
            </List>

            <Divider />

            <Box sx={{ p: 2, mt: "auto", textAlign: "center" }}>
                <Typography variant="caption" color="text.secondary" display="block">
                    ©2025 BKStar Classroom
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                    Version 1.3.1
                </Typography>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <AppBar component="nav" position="fixed" elevation={0}>
                <Toolbar
                    sx={{
                        backgroundColor: "#fff",
                        color: "#000",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { md: "none" } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    {/* Logo Section */}
                    <Box>
                        <Box
                            sx={{ flex: 1, display: "flex", alignItems: "center", gap: 1 }}
                        >
                            <Box
                                component="img"
                                src="https://bk-exam-public.s3.ap-southeast-1.amazonaws.com/logo2.png"
                                alt="logo"
                                sx={{
                                    height: 30,
                                    display: { xs: "none", md: "block" },
                                }}
                            />
                            <Box textAlign="left">
                                <Typography
                                    variant="h6"
                                    component="div"
                                    sx={{
                                        fontWeight: 700,
                                        letterSpacing: ".05rem",
                                        lineHeight: 1.2,
                                    }}
                                >
                                    <span style={{ color: "#0b3d91" }}>BK</span>
                                    <span style={{ color: "#ff8c00" }}>Star</span>
                                </Typography>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{
                                        display: { xs: "none", md: "block" },
                                    }}
                                >
                                    Classroom
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    {/* Actions */}
                    <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", ml: "auto" }}>
                        {isTeacher && (
                            <Button
                                variant="outlined"
                                startIcon={<AddIcon />}
                                onClick={() => navigate(ROUTES.CLASS_ADD)}
                                sx={{
                                    mr: 2,
                                    color: "#1976d2",
                                    borderColor: "#1976d2",
                                    textTransform: "none",
                                    fontWeight: 500,
                                }}
                            >
                                Tạo lớp
                            </Button>
                        )}
                        <Button
                            startIcon={<HomeIcon />}
                            onClick={() => navigate(ROUTES.DASHBOARD)}
                            sx={{
                                color: "#1976d2",
                                textTransform: "none",
                                fontWeight: 500,
                            }}
                        >
                            Trang chủ
                        </Button>
                    </Box>

                    {/* User */}
                    <Box sx={{ ml: 2, display: "flex", alignItems: "center" }}>
                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0.5 }}>
                            <Avatar src={avatarUrl} sx={{ width: 36, height: 36, mr: 1 }} />
                            <Box
                                sx={{
                                    display: { xs: "none", md: "flex" },
                                    flexDirection: "column",
                                    alignItems: "flex-start",
                                    mr: 0.5,
                                }}
                            >
                                <Typography variant="body2" fontWeight={500}>
                                    {userName}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {userRole}
                                </Typography>
                            </Box>
                            <ArrowDropDownIcon sx={{ color: "#5f6368" }} />
                        </IconButton>

                        <Menu
                            sx={{ mt: "45px" }}
                            anchorEl={anchorElUser}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            <MenuItem
                                onClick={() => {
                                    handleCloseUserMenu();
                                    navigate(ROUTES.PROFILE);
                                }}
                            >
                                Thông tin cá nhân
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    handleCloseUserMenu();
                                    logout();
                                }}
                            >
                                Đăng xuất
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>

            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: "block", sm: "block" },
                    "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
                }}
            >
                {drawer}
            </Drawer>
        </Box>
    );
};

export default Header;
